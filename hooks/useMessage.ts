import { useEffect, useCallback } from "react";
import * as Crypto from "expo-crypto";
import { useAuthStore } from "./store/useAuthStore";
import {
    ILocalMessage, SendMessagePayload,
    MessageType, NewMessageData,
    MessageDraft
} from "../types/message.types";
import { useMessagesStore } from "./store/useMessageStore";
import { axiosInstance } from "../lib/axios.config";
import socketService, { SOCKET_EVENTS } from "../services/socket.service";

interface UseSendMessageOptions {
    chatId?: string;
    receiverId?: string;
    phoneNumber: string;  // ✅ always pass this
}

export function useMessages({ chatId, receiverId, phoneNumber }: UseSendMessageOptions) {

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

    // ── Single send function handles everything ──────
    const sendMessage = useCallback(async (draft: MessageDraft) => {
        if (!user) return;
        if (!draft.text?.trim() && !draft.asset && !draft.location && !draft.contact) return;

        const clientMessageId = Crypto.randomUUID();

        const type: MessageType =
            draft.asset ? (draft.assetType ?? "image") :
                draft.location ? "location" :
                    draft.contact ? "contact" :
                        "text";

        const optimistic: ILocalMessage = {
            _id: clientMessageId,
            chatId: chatId ?? "",
            senderId: user._id,
            receiverId: receiverId ?? "",
            type,
            text: draft.text?.trim() ?? null,
            status: "pending",
            isDeleted: false,
            isEdited: false,
            isStarred: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            clientMessageId,
            isOptimistic: true,
            ...(draft.asset && {
                file: {
                    _id: clientMessageId,
                    secureUrl: draft.asset.uri,
                    type,
                    metadata: {},
                },
            }),
            ...(draft.location && { location: draft.location }),
            ...(draft.contact && { contact: draft.contact }),
            ...(draft.replyTo && { replyTo: draft.replyTo }),
        };

        addMessage(chatId ?? phoneNumber, optimistic); // ✅ use phoneNumber as key if no chatId

        try {
            let fileId: string | undefined;

            if (draft.asset) {
                const { data: signature } = await axiosInstance.post("/files/signature", { type });

                const formData = new FormData() as any;
                formData.append("file", {
                    uri: draft.asset.uri,
                    type: draft.asset.mimeType,
                    name: draft.asset.fileName ?? `file.${draft.asset.uri.split(".").pop()}`,
                });
                formData.append("signature", signature.signature);
                formData.append("timestamp", signature.timestamp);
                formData.append("api_key", signature.apiKey);
                formData.append("folder", signature.folder);
                formData.append("cloud_name", signature.cloudName);

                const { data: cloudinaryData } = await axiosInstance.post(
                    signature.uploadUrl, formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                const { data: fileData } = await axiosInstance.post("/files/confirm", {
                    cloudinaryData, type, chatId,
                });

                fileId = fileData.fileId;
            }

            // ✅ Emit with both receiverId AND phoneNumber
            socketService.emit(SOCKET_EVENTS.MESSAGE_SEND, {
                chatId,
                receiverId,
                phoneNumber,    // ✅ server uses this if no receiverId
                type,
                text: draft.text?.trim(),
                fileId,
                location: draft.location,
                contact: draft.contact,
                replyTo: draft.replyTo,
                clientMessageId,
            } as SendMessagePayload);

        } catch (err) {
            console.error("Failed to send message:", err);
            updateMessageStatus(chatId ?? phoneNumber, clientMessageId, "failed");
        }

    }, [chatId, receiverId, phoneNumber, user]);

    return { messages: chatMessages, sendMessage, fetchMessages };
};