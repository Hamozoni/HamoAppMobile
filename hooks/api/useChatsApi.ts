import { useEffect, useCallback, useState } from "react";
import { axiosInstance } from "../../lib/axios.config";
import { useChatsStore } from "../store/useChatsStore";

export interface IChat {
    _id: string;
    isGroup: boolean;
    groupName?: string;
    contactId: string | null;
    lastMessage: {
        type: string;
        text: string | null;
        createdAt: string;
        rawTime: number;        // ✅ timestamp for sorting
        isMine: boolean;
        isRead: boolean;
    };
    unreadCount: number;
    isOnline: boolean;
    isPinned: boolean;
    isArchived: boolean;
}

export function useChats() {
    const { chats, setChats } = useChatsStore();
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        fetchChats();
    }, []);

    return { chats, loading, fetchChats };
}
