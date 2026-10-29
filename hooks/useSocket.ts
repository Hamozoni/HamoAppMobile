// src/hooks/useSocketListeners.ts
import { useEffect } from "react";
import { socketService, SOCKET_EVENTS } from "../services/socket.service";
import { useMessagesStore } from "../hooks/store/useMessageStore";
import { useChatsStore } from "./store/useChatsStore";
import { useAuthStore } from "./store/useAuthStore";

export const useSocketListeners = () => {

    const addMessage = useMessagesStore((state) => state.addMessage);
    const updateMessageStatus = useMessagesStore((state) => state.updateMessageStatus);
    const updateLastMessage = useChatsStore(state => state.updateLastMessage)
    const replaceOptimistic = useMessagesStore((state) => state.replaceOptimistic);
    const user = useAuthStore((state) => state.user);
    useEffect(() => {
        const socket = socketService.socket;
        if (!socket) return;

        // 1. Listen for incoming messages from other users



        // 3. Listen for online/offline status changes of contacts
        socketService.on("user_online_status", (data: { userId: string; isOnline: boolean; lastSeen: string }) => {
            console.log("📥 Global Event - User Status:", data);
            // You can store this in a user status store if you have one
        });

        // Cleanup listeners when component unmounts or socket disconnects
        return () => {

        };
    }, [socketService.isSocketConnected]); // Re-binds if socket reconnects
};