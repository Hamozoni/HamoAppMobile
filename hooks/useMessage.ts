import { useEffect, useCallback, useState, useRef } from "react";
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
import axios from "axios";
import { formatMessageTime } from "../utils";
import { useChatsStore } from "./store/useChatsStore";

interface UseSendMessageOptions {
    phoneNumber: string;
}

export function useMessages({ phoneNumber }: UseSendMessageOptions) {

    const user = useAuthStore(state => state.user);
    const [currentChatId, setCurrentChatId] = useState<string | undefined>(undefined);
    const currentChatIdRef = useRef<string | undefined>(undefined);

    const {
        messages, addMessage, replaceOptimistic,
        updateMessageStatus, setMessages,
    } = useMessagesStore();

    const { updateLastMessage, incrementUnread } = useChatsStore();

    const chatMessages = messages[currentChatId ?? phoneNumber] ?? [];

    // ── Keep ref in sync with state ──────────────
    useEffect(() => {
        currentChatIdRef.current = currentChatId;
    }, [currentChatId]);

    // ── Helper: update chat list preview ─────────
    const updateChatPreview = useCallback((
        chatId: string,
        message: ILocalMessage,
        isMine: boolean
    ) => {
        updateLastMessage(chatId, {
            type: message.type,
            text: message.text ?? null,
            createdAt: formatMessageTime(message.createdAt),
            rawTime: new Date(message.createdAt).getTime(),
            isMine,
            isRead: false,
        });
    }, [updateLastMessage]);

    // ── Fetch messages ────────────────────────────
    const fetchMessages = useCallback(async () => {
        if (!currentChatIdRef.current) {
            console.log("⚠️ No chatId yet — new chat");
            return;
        }
        try {
            console.log("📤 Fetching messages:", currentChatIdRef.current);
            const { data } = await axiosInstance.get(`/messages/${currentChatIdRef.current}`);
            console.log("✅ Messages fetched:", data.messages.length);
            setMessages(currentChatIdRef.current, data.messages);
        } catch (err: any) {
            console.error("Failed to fetch messages:", err.response?.status, err.response?.data);
        }
    }, []);

    // ── Fetch chat by phoneNumber on mount ────────
    useEffect(() => {
        const fetchChatByPhone = async () => {
            try {
                console.log("📤 Looking up chat for:", phoneNumber);
                const { data } = await axiosInstance.get(`/chats/phone/${phoneNumber}`);
                if (data?.chatId) {
                    console.log("✅ Existing chat found:", data.chatId);
                    setCurrentChatId(data.chatId);
                    currentChatIdRef.current = data.chatId;
                } else {
                    console.log("💬 No existing chat — will create on first message");
                }
            } catch (err: any) {
                if (err.response?.status !== 404) {
                    console.error("Failed to look up chat:", err.response?.status);
                }
            }
        };

        fetchChatByPhone();
    }, [phoneNumber]);

    // ── New chat created listener ─────────────────
    useEffect(() => {
        const handleNewChat = (chat: any) => {
            console.log("🆕 New chat created:", chat._id);
            setCurrentChatId(chat._id);
            currentChatIdRef.current = chat._id;
            socketService.joinChat(chat._id);
        };

        socketService.on("chat:new", handleNewChat);
        return () => socketService.off("chat:new", handleNewChat);
    }, []);

    // ── Message listeners ─────────────────────────
    useEffect(() => {
        if (currentChatId) {
            socketService.joinChat(currentChatId);
            fetchMessages();
        }

        const handleNewMessage = (data: NewMessageData) => {
            const activeChatId = currentChatIdRef.current;

            console.log("📨 MESSAGE_NEW received:", {
                dataChatId: data.chatId,
                activeChatId,
                isOwnMessage: !!data.clientMessageId,
            });

            const isOwnMessage = !!data.clientMessageId;

            if (isOwnMessage) {
                const key = activeChatId ?? phoneNumber;
                replaceOptimistic(key, data.clientMessageId!, {
                    ...data.message,
                    chatId: data.chatId,
                });
                // ✅ update chat preview for sent message
                updateChatPreview(data.chatId, data.message, true);

                if (!activeChatId && data.chatId) {
                    setCurrentChatId(data.chatId);
                    currentChatIdRef.current = data.chatId;
                    socketService.joinChat(data.chatId);
                }
                return;
            }

            // ── Incoming from other user ──────────
            if (!activeChatId) {
                setCurrentChatId(data.chatId);
                currentChatIdRef.current = data.chatId;
                socketService.joinChat(data.chatId);
                addMessage(data.chatId, data.message);
            } else if (data.chatId === activeChatId) {
                addMessage(activeChatId, data.message);
            } else {
                console.log("⚠️ Ignoring — different chat");
                return;
            }

            // ✅ update chat preview for received message
            updateChatPreview(data.chatId, data.message, false);
            incrementUnread(data.chatId);
        };

        const handleDelivered = (data: any) => {
            const activeChatId = currentChatIdRef.current;
            if (!activeChatId || data.chatId !== activeChatId) return;
            if (data.messageId) {
                updateMessageStatus(activeChatId, data.messageId, data.status);
            }
        };

        const handleRead = (data: any) => {
            const activeChatId = currentChatIdRef.current;
            if (!activeChatId || data.chatId !== activeChatId) return;
            if (data.messageId) {
                updateMessageStatus(activeChatId, data.messageId, "read");
            }
        };

        socketService.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
        socketService.on(SOCKET_EVENTS.MESSAGE_DELIVERED, handleDelivered);
        socketService.on(SOCKET_EVENTS.MESSAGE_READ, handleRead);

        return () => {
            if (currentChatId) socketService.leaveChat(currentChatId);
            socketService.off(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
            socketService.off(SOCKET_EVENTS.MESSAGE_DELIVERED, handleDelivered);
            socketService.off(SOCKET_EVENTS.MESSAGE_READ, handleRead);
        };
    }, [currentChatId]);

    // ── Send message ──────────────────────────────
    const sendMessage = useCallback(async (draft: MessageDraft) => {
        if (!user) return;
        if (!draft.text?.trim() && !draft.asset && !draft.location && !draft.contact) return;

        const clientMessageId = Crypto.randomUUID();
        const type: MessageType =
            draft.asset ? (draft.assetType ?? "image") :
                draft.location ? "location" :
                    draft.contact ? "contact" :
                        "text";

        const now = new Date().toISOString();

        const optimistic: ILocalMessage = {
            _id: clientMessageId,
            chatId: currentChatIdRef.current ?? "",
            senderId: user._id,
            receiverId: "",
            type,
            text: draft.text?.trim() ?? null,
            status: "pending",
            isDeleted: false,
            isEdited: false,
            isStarred: false,
            createdAt: now,
            updatedAt: now,
            clientMessageId,
            isOptimistic: true,
            ...(draft.asset && { file: { _id: clientMessageId, secureUrl: draft.asset.uri, type, metadata: {} } }),
            ...(draft.location && { location: draft.location }),
            ...(draft.contact && { contact: draft.contact }),
            ...(draft.replyTo && { replyTo: draft.replyTo }),
        };

        const storeKey = currentChatIdRef.current ?? phoneNumber;
        addMessage(storeKey, optimistic);

        // ✅ Optimistically update chat list preview
        if (currentChatIdRef.current) {
            updateLastMessage(currentChatIdRef.current, {
                type,
                text: draft.text?.trim() ?? null,
                createdAt: formatMessageTime(now),
                rawTime: Date.now(),
                isMine: true,
                isRead: false,
            });
        }

        try {
            let fileId: string | undefined;

            if (draft.asset) {
                console.log("📤 Getting signature...");
                const { data: signature } = await axiosInstance.post("/files/signature", { type });
                console.log("✅ Signature:", signature);

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

                console.log("📤 Uploading to Cloudinary...", signature.uploadUrl);
                const { data: cloudinaryData } = await axios.post(signature.uploadUrl, formData);
                console.log("✅ Cloudinary upload:", cloudinaryData.secure_url);

                console.log("📤 Confirming file...");
                const { data: fileData } = await axiosInstance.post("/files/confirm", {
                    cloudinaryData,
                    type,
                    chatId: currentChatIdRef.current,
                });
                console.log("✅ File confirmed:", fileData.fileId);

                fileId = fileData.fileId;
            }

            console.log("📤 Emitting message...", { phoneNumber, type, fileId, clientMessageId });
            socketService.emit(SOCKET_EVENTS.MESSAGE_SEND, {
                chatId: currentChatIdRef.current,
                phoneNumber,
                type,
                text: draft.text?.trim(),
                fileId,
                location: draft.location,
                contact: draft.contact,
                replyTo: draft.replyTo,
                clientMessageId,
            } as SendMessagePayload);
            console.log("✅ Message emitted");

        } catch (err) {
            console.error("Failed to send message:", err);
            updateMessageStatus(storeKey, clientMessageId, "failed");
        }

    }, [phoneNumber, user]);

    return {
        messages: chatMessages,
        sendMessage,
        fetchMessages,
        currentChatId,
    };
}