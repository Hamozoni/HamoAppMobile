// src/hooks/useSocketListeners.ts
import { useEffect } from "react";
import { socketService, SOCKET_EVENTS } from "../services/socket.service";
import { useMessagesStore } from "../hooks/store/useMessageStore";
import { useChatsStore } from "./store/useChatsStore";
export const useSocketListeners = () => {

    const addMessage = useMessagesStore((state) => state.addMessage);
    const updateMessageStatus = useMessagesStore((state) => state.updateMessageStatus);
    const updateLastMessage = useChatsStore(state => state.updateLastMessage)

    useEffect(() => {
        const socket = socketService.socket;
        if (!socket) return;

        // 1. Listen for incoming messages from other users
        socketService.on(SOCKET_EVENTS.MESSAGE_NEW, (incomingMessage: any) => {
            if (incomingMessage?.chatId) {
                addMessage(incomingMessage.chatId, incomingMessage);
                updateLastMessage(incomingMessage.chatId, {
                    lastMessageAt: incomingMessage.createdAt,
                    lastMessageId: incomingMessage._id,
                    lastMessageSenderId: incomingMessage.senderId,
                    lastMessageStatus: incomingMessage.status,
                    lastMessageText: incomingMessage.content,
                    lastMessageType: incomingMessage.type,
                })

            }
        });

        // 2. Listen for message status updates (e.g., sent -> delivered -> read)
        socketService.on(SOCKET_EVENTS.MESSAGE_STATUS, (data: { chatId: string; messageId: string; status: string }) => {
            console.log("📥 Global Event - Status Updated:", data);
            if (data?.chatId && data?.messageId && data?.status) {
                updateMessageStatus(data.chatId, data.messageId, data.status);
            }
        });

        // 3. Listen for online/offline status changes of contacts
        socketService.on("user_online_status", (data: { userId: string; isOnline: boolean; lastSeen: string }) => {
            console.log("📥 Global Event - User Status:", data);
            // You can store this in a user status store if you have one
        });

        // Cleanup listeners when component unmounts or socket disconnects
        return () => {
            socketService.off("receive_message");
            socketService.off("message_status_updated");
            socketService.off("user_online_status");
        };
    }, [socketService.socket?.connected]); // Re-binds if socket reconnects
};