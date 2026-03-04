import { useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "./store/useAuthStore";
import {
    ILocalMessage, SendMessagePayload,
    MessageType, NewMessageData
} from "../types/message.types";
import { useMessagesStore } from "./store/useMessageStore";
import { axiosInstance } from "../lib/axios.config";
import socketService, { SOCKET_EVENTS } from "../services/socket.service";

interface UseSendMessageOptions {
    chatId?: string;
    receiverId: string;
}

export function useMessages({ chatId, receiverId }: UseSendMessageOptions) {
    const user = useAuthStore(state => state.user);
    const {
        messages, addMessage, replaceOptimistic,
        updateMessageStatus, setMessages,
    } = useMessagesStore();

    const chatMessages = messages[chatId ?? ""] ?? [];

    // ── Fetch initial messages ───────────────────
    const fetchMessages = useCallback(async () => {
        if (!chatId) return;
        try {
            const { data } = await axiosInstance.get(`/messages/${chatId}`);
            setMessages(chatId, data.messages);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        }
    }, [chatId]);

    // ── Listen for incoming messages ─────────────
    useEffect(() => {
        if (!chatId) return;

        // Join chat room
        socketService.joinChat(chatId);
        fetchMessages();

        // Listen for new messages
        const handleNewMessage = (data: NewMessageData) => {
            if (data.chatId !== chatId) return;

            if (data.clientMessageId) {
                // ✅ Replace our optimistic message with real one
                replaceOptimistic(chatId, data.clientMessageId, data.message);
            } else {
                // ✅ Incoming message from other user
                addMessage(chatId, data.message);
            }
        };

        // Listen for status updates
        const handleDelivered = (data: any) => {
            if (data.chatId !== chatId) return;
            if (data.messageId) {
                updateMessageStatus(chatId, data.messageId, data.status);
            }
        };

        const handleRead = (data: any) => {
            if (data.chatId !== chatId) return;
            if (data.messageId) {
                updateMessageStatus(chatId, data.messageId, "read");
            }
        };

        socketService.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
        socketService.on(SOCKET_EVENTS.MESSAGE_DELIVERED, handleDelivered);
        socketService.on(SOCKET_EVENTS.MESSAGE_READ, handleRead);

        return () => {
            socketService.leaveChat(chatId);
            socketService.off(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
            socketService.off(SOCKET_EVENTS.MESSAGE_DELIVERED, handleDelivered);
            socketService.off(SOCKET_EVENTS.MESSAGE_READ, handleRead);
        };
    }, [chatId]);

    // ── Send text message ────────────────────────
    const sendTextMessage = useCallback((text: string) => {
        if (!text.trim() || !user) return;

        const clientMessageId = uuidv4();

        // ✅ Optimistic message — show immediately
        const optimistic: ILocalMessage = {
            _id: clientMessageId,
            chatId: chatId ?? "",
            senderId: user._id,
            receiverId,
            type: "text",
            text,
            status: "pending",
            isDeleted: false,
            isEdited: false,
            isStarred: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            clientMessageId,
            isOptimistic: true,
        };

        addMessage(chatId ?? "", optimistic);

        // ✅ Emit to server
        socketService.emit(SOCKET_EVENTS.MESSAGE_SEND, {
            chatId,
            receiverId,
            type: "text",
            text,
            clientMessageId,
        } as SendMessagePayload);

    }, [chatId, receiverId, user]);

    // ── Send media message ───────────────────────
    const sendMediaMessage = useCallback(async (
        asset: any,   // expo ImagePicker asset
        type: MessageType,
    ) => {
        if (!user) return;
        const clientMessageId = uuidv4();

        // ✅ Show optimistic message with local URI
        const optimistic: ILocalMessage = {
            _id: clientMessageId,
            chatId: chatId ?? "",
            senderId: user._id,
            receiverId,
            type,
            file: {
                _id: clientMessageId,
                secureUrl: asset.uri,    // local URI for instant preview
                type,
                metadata: {},
            },
            status: "pending",
            isDeleted: false,
            isEdited: false,
            isStarred: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            clientMessageId,
            isOptimistic: true,
        };

        addMessage(chatId ?? "", optimistic);

        try {
            // ✅ Step 1 — Get upload signature
            const { data: signature } = await axiosInstance.post("/files/signature", { type });

            // ✅ Step 2 — Upload to Cloudinary (same pattern as profile picture)
            const formData = new FormData() as any;
            formData.append("file", {
                uri: asset.uri,
                type: asset.mimeType,
                name: asset.fileName ?? `file.${asset.uri.split(".").pop()}`,
            });
            formData.append("signature", signature.signature);
            formData.append("timestamp", signature.timestamp);
            formData.append("api_key", signature.apiKey);
            formData.append("folder", signature.folder);
            formData.append("cloud_name", signature.cloudName);

            const { data: cloudinaryData } = await axiosInstance.post(
                signature.uploadUrl,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            // ✅ Step 3 — Confirm file with server
            const { data: fileData } = await axiosInstance.post("/files/confirm", {
                cloudinaryData,
                type,
                chatId,
            });

            // ✅ Step 4 — Emit message with real fileId
            socketService.emit(SOCKET_EVENTS.MESSAGE_SEND, {
                chatId,
                receiverId,
                type,
                fileId: fileData.fileId,
                clientMessageId,
            } as SendMessagePayload);

        } catch (err) {
            console.error("Failed to send media:", err);
            // Mark optimistic message as failed
            updateMessageStatus(chatId ?? "", clientMessageId, "failed");
        }
    }, [chatId, receiverId, user]);

    return {
        messages: chatMessages,
        sendTextMessage,
        sendMediaMessage,
        fetchMessages,
    };
}