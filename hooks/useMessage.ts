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

    // ── Single send function handles everything ──────
    const sendMessage = useCallback(async (draft: MessageDraft) => {
        if (!user) return;
        if (!draft.text?.trim() && !draft.asset && !draft.location && !draft.contact) return;

        const clientMessageId = Crypto.randomUUID();

        // ── Determine message type ───────────────────
        const type: MessageType =
            draft.asset ? (draft.assetType ?? "image") :
                draft.location ? "location" :
                    draft.contact ? "contact" :
                        "text";

        // ── Build optimistic message ─────────────────
        const optimistic: ILocalMessage = {
            _id: clientMessageId,
            chatId: chatId ?? "",
            senderId: user._id,
            receiverId,
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

            // Show local URI instantly for media
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

        // ✅ Show message instantly
        addMessage(chatId ?? "", optimistic);

        try {
            let fileId: string | undefined;

            // ── Upload media if exists ───────────────
            if (draft.asset) {
                // Step 1 — Get signature
                const { data: signature } = await axiosInstance.post(
                    "/files/signature",
                    { type }
                );

                // Step 2 — Upload to Cloudinary
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
                    signature.uploadUrl,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                // Step 3 — Confirm with server
                const { data: fileData } = await axiosInstance.post("/files/confirm", {
                    cloudinaryData,
                    type,
                    chatId,
                });

                fileId = fileData.fileId;

                // ✅ Update optimistic message with real URL
                replaceOptimistic(chatId ?? "", clientMessageId, {
                    ...optimistic,
                    file: {
                        _id: fileId!,
                        secureUrl: fileData.secureUrl,
                        thumbnailUrl: fileData.thumbnailUrl,
                        type,
                        metadata: fileData.metadata,
                    },
                    isOptimistic: true, // still optimistic until server confirms
                });
            }

            // ── Emit to server ───────────────────────
            socketService.emit(SOCKET_EVENTS.MESSAGE_SEND, {
                chatId,
                receiverId,
                type,
                text: draft.text?.trim(),    // ✅ text alongside any type
                fileId,
                location: draft.location,
                contact: draft.contact,
                replyTo: draft.replyTo,
                clientMessageId,
            } as SendMessagePayload);

        } catch (err) {
            console.error("Failed to send message:", err);
            // ✅ Mark as failed
            updateMessageStatus(chatId ?? "", clientMessageId, "failed");
        }

    }, [chatId, receiverId, user]);

    return {
        messages: chatMessages,
        sendMessage, // ✅ single function for everything
        fetchMessages,
    };
}