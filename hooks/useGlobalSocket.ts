import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useChatsStore } from "./store/useChatsStore";
import socketService from "../services/socket.service";
import notificationService from "../services/notification.service";
import { formatMessageTime } from "../utils";
import soundService from "../services/sound.service";
import { getMessagePreview } from "./useMessage";

export function useGlobalSocketListeners() {
    const user = useAuthStore(state => state.user);
    const { updateChat, incrementUnread } = useChatsStore();

    useEffect(() => {
        if (!user) return;

        console.log("✅ Global socket listeners registered");

        const handleChatUpdated = (data: any) => {
            console.log("🔄 chat:updated received:", data);
            const isMine = data.senderId === user._id;

            updateChat(data.chatId, {
                lastMessage: {
                    type: data.lastMessageType,
                    text: data.lastMessageText,
                    createdAt: formatMessageTime(data.lastMessageAt),
                    rawTime: new Date(data.lastMessageAt).getTime(),
                    isMine,
                    isRead: false,
                },
            });

            if (!isMine) {
                incrementUnread(data.chatId);
            }
        };

        const handleNewMessage = async (data: any) => {
            console.log("🔔 Global new message received");
            const isMine = data.message?.senderId?._id === user._id ||
                data.message?.senderId === user._id;

            if (!isMine) {
                // ✅ Always play sound
                await soundService.playMessageSound();

                // ✅ Show notification
                const sender = data.message?.senderId as any;
                await notificationService.showMessageNotification({
                    senderName: sender?.displayName ?? "New Message",
                    messageText: getMessagePreview(data.message),
                    chatId: data.chatId,
                    phoneNumber: sender?.phoneNumber ?? "",
                });
            }
        };

        const handleNewChat = () => {
            console.log("🆕 New chat — will be fetched on next chats page open");
        };

        socketService.on("chat:updated", handleChatUpdated);
        socketService.on("chat:new", handleNewChat);
        socketService.on("message:new", handleNewMessage);

        return () => {
            socketService.off("chat:updated", handleChatUpdated);
            socketService.off("chat:new", handleNewChat);
            socketService.off("message:new", handleNewMessage);
        };
    }, [user?._id]);
}