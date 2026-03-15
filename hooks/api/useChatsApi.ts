import { useEffect, useCallback, useState } from "react";
import { axiosInstance } from "../../lib/axios.config";
import { useChatsStore } from "../store/useChatsStore";
import socketService from "../../services/socket.service";
import { formatMessageTime } from "../../utils";
import { useAuthStore } from "../store/useAuthStore";

export function useChats() {
    const { chats, setChats, updateChat, incrementUnread } = useChatsStore();
    const [loading, setLoading] = useState(false);
    const user = useAuthStore(state => state.user);

    const fetchChats = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get("/chats");
            setChats(data.chats);
        } catch (err: any) {
            console.error("Failed to fetch chats:", err.response?.status);
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ Listen for real-time chat updates
    useEffect(() => {
        const handleChatUpdated = (data: any) => {
            console.log("🔄 chat:updated received:", data);
            const isMine = data.senderId === user?._id;

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

            // ✅ Increment unread for received messages
            if (!isMine) {
                incrementUnread(data.chatId);
            }
        };

        const handleNewChat = (chat: any) => {
            console.log("🆕 New chat — refetching chats list");
            fetchChats(); // ✅ refetch to get new chat in list
        };

        socketService.on("chat:updated", handleChatUpdated);
        socketService.on("chat:new", handleNewChat);

        return () => {
            socketService.off("chat:updated", handleChatUpdated);
            socketService.off("chat:new", handleNewChat);
        };
    }, [user?._id]);

    useEffect(() => {
        fetchChats();
    }, []);

    return { chats, loading, fetchChats };
}
