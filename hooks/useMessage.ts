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

interface UseSendMessageOptions {
    phoneNumber: string;
}

export function useMessages({ phoneNumber }: UseSendMessageOptions) {

    const user = useAuthStore(state => state.user);
    const [currentChatId, setCurrentChatId] = useState<string | undefined>(undefined);

    const {
        messages, addMessage, replaceOptimistic,
        updateMessageStatus, setMessages,
    } = useMessagesStore();

    const chatMessages = messages[currentChatId ?? phoneNumber] ?? [];

    // ── Fetch messages ───────────────────────────
    const fetchMessages = useCallback(async () => {
        if (!currentChatId) {
            console.log("⚠️ No chatId yet — new chat");
            return;
        }
        try {
            console.log("📤 Fetching messages:", currentChatId);
            const { data } = await axiosInstance.get(`/messages/${currentChatId}`);
            console.log("✅ Messages fetched:", data.messages.length);
            setMessages(currentChatId, data.messages);
        } catch (err: any) {
            console.error("Failed to fetch messages:", err.response?.status, err.response?.data);
        }
    }, [currentChatId]);

    // ── New chat listener ────────────────────────
    useEffect(() => {
        const handleNewChat = (chat: any) => {
            console.log("🆕 New chat created:", chat._id);
            setCurrentChatId(chat._id);
            socketService.joinChat(chat._id);
        };

        socketService.on("chat:new", handleNewChat);
        return () => socketService.off("chat:new", handleNewChat);
    }, []);

    const currentChatIdRef = useRef<string | undefined>(undefined);


    // ── Message listeners ────────────────────────
    useEffect(() => {
        if (currentChatId) {
            socketService.joinChat(currentChatId);
            fetchMessages();
        }

        currentChatIdRef.current = currentChatId;
        const handleNewMessage = (data: NewMessageData) => {
            const activeChatId = currentChatIdRef.current; // ✅ always fresh value

            console.log("📨 MESSAGE_NEW received:", {
                dataChatId: data.chatId,
                currentChatId: activeChatId,
                isOwnMessage: !!data.clientMessageId,
            });

            const isOwnMessage = !!data.clientMessageId;

            if (isOwnMessage) {
                const key = activeChatId ?? phoneNumber;
                replaceOptimistic(key, data.clientMessageId!, {
                    ...data.message,
                    chatId: data.chatId,
                });
                if (!activeChatId && data.chatId) {
                    setCurrentChatId(data.chatId);
                    currentChatIdRef.current = data.chatId;
                    socketService.joinChat(data.chatId);
                }
                return;
            }

            // Incoming from other user
            if (!activeChatId) {
                // New chat — accept and set chatId
                setCurrentChatId(data.chatId);
                currentChatIdRef.current = data.chatId;
                socketService.joinChat(data.chatId);
                addMessage(data.chatId, data.message);
            } else if (data.chatId === activeChatId) {
                addMessage(activeChatId, data.message);
            } else {
                console.log("⚠️ Ignoring — different chat");
            }
        };


        const handleDelivered = (data: any) => {
            if (data.chatId !== currentChatId) return;
            if (data.messageId) {
                updateMessageStatus(currentChatId ?? phoneNumber, data.messageId, data.status);
            }
        };

        const handleRead = (data: any) => {
            if (data.chatId !== currentChatId) return;
            if (data.messageId) {
                updateMessageStatus(currentChatId ?? phoneNumber, data.messageId, "read");
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

    // ── Fetch chat by phoneNumber on mount ───────
    useEffect(() => {
        const fetchChatByPhone = async () => {
            try {
                console.log("📤 Looking up chat for:", phoneNumber);
                const { data } = await axiosInstance.get(`/chats/phone/${phoneNumber}`);
                if (data?.chatId) {
                    console.log("✅ Existing chat found:", data.chatId);
                    setCurrentChatId(data.chatId);
                } else {
                    console.log("💬 No existing chat — will create on first message");
                }
            } catch (err: any) {
                // 404 = no chat yet, that's fine
                if (err.response?.status !== 404) {
                    console.error("Failed to look up chat:", err.response?.status);
                }
            }
        };

        fetchChatByPhone();
    }, [phoneNumber]);

    // ── Send message ─────────────────────────────
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
            chatId: currentChatId ?? "",
            senderId: user._id,
            receiverId: "",
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
            ...(draft.asset && { file: { _id: clientMessageId, secureUrl: draft.asset.uri, type, metadata: {} } }),
            ...(draft.location && { location: draft.location }),
            ...(draft.contact && { contact: draft.contact }),
            ...(draft.replyTo && { replyTo: draft.replyTo }),
        };

        addMessage(currentChatId ?? phoneNumber, optimistic);

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
                    chatId: currentChatId,
                });
                console.log("✅ File confirmed:", fileData.fileId);

                fileId = fileData.fileId;
            }

            console.log("📤 Emitting message...", { phoneNumber, type, fileId, clientMessageId });
            socketService.emit(SOCKET_EVENTS.MESSAGE_SEND, {
                chatId: currentChatId,
                phoneNumber,                    // ✅ server resolves receiverId from this
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
            updateMessageStatus(currentChatId ?? phoneNumber, clientMessageId, "failed");
        }

    }, [currentChatId, phoneNumber, user]);

    return {
        messages: chatMessages,
        sendMessage,
        fetchMessages,
        currentChatId,
    };
}