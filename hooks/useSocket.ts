// src/hooks/useSocketListeners.ts
import { useEffect } from "react";
import { socketService, SOCKET_EVENTS } from "../services/socket.service";
import { useMessagesStore } from "../hooks/store/useMessageStore";
import { useChatsStore } from "./store/useChatsStore";

export const useSocketListeners = () => {

    const addMessage = useMessagesStore((state) => state.addMessage);
    const updateLastMessage = useChatsStore(state => state.updateLastMessage)
    const replaceOptimistic = useMessagesStore((state) => state.replaceOptimistic);
    useEffect(() => {
        const socket = socketService.socket;
        if (!socket) return;

        // 1. Listen for incoming messages from other users

        socketService.on(SOCKET_EVENTS.CHAT_NOTIFICATION, ({ message }) => {
            addMessage(message.chatId, message);
            updateLastMessage(message.chatId, {
                lastMessageAt: message.createdAt,
                lastMessageId: message._id,
                lastMessageSenderId: message.senderId,
                lastMessageStatus: message.status,
                lastMessageText: message.text,
                lastMessageType: message.type,
            });
        });

        socketService.on(SOCKET_EVENTS.MESSAGE_NEW, (message) => {
            addMessage(message.chatId, message);
            updateLastMessage(message.chatId, {
                lastMessageAt: message.createdAt,
                lastMessageId: message._id,
                lastMessageSenderId: message.senderId,
                lastMessageStatus: message.status,
                lastMessageText: message.text,
                lastMessageType: message.type,
            });
        });


        socketService.on(
            SOCKET_EVENTS.MESSAGE_SENT_ACKNOWLEDGEMENT,
            ({ message, clientMessageId }: { message: any; clientMessageId: string }) => {


                replaceOptimistic(message.chatId, clientMessageId, message);
                updateLastMessage(message.chatId, {
                    lastMessageId: message._id,
                    lastMessageStatus: message.status,
                });
            });



        // 3. Listen for online/offline status changes of contacts
        socketService.on("user_online_status", (data: { userId: string; isOnline: boolean; lastSeen: string }) => {
            console.log("📥 Global Event - User Status:", data);
            // You can store this in a user status store if you have one
        });

        // Cleanup listeners when component unmounts or socket disconnects
        return () => {
            socketService.off(SOCKET_EVENTS.CHAT_NOTIFICATION);
            socketService.off(SOCKET_EVENTS.MESSAGE_SENT_ACKNOWLEDGEMENT);
            socketService.off(SOCKET_EVENTS.MESSAGE_NEW);
            socketService.off(SOCKET_EVENTS.CHAT_NOTIFICATION);
            socketService.off(SOCKET_EVENTS.CHAT_NOTIFICATION);
        };
    }, [socketService.isSocketConnected]); // Re-binds if socket reconnects
};