import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../../lib/axios.config";

export interface IChat {
    _id: string;
    isGroup: boolean;
    groupName?: string;
    contact: {
        _id: string;
        displayName: string;
        phoneNumber: string;
        photoURL: string | null;
    };
    lastMessage: {
        type: string;
        text: string | null;
        createdAt: string;
        isMine: boolean;
        isRead: boolean;
    };
    unreadCount: number;
    isOnline: boolean;
    isPinned: boolean;
    isArchived: boolean;
}

export function useChats() {
    const [chats, setChats] = useState<IChat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchChats = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get("/chats");
            setChats(data.chats);
        } catch (err: any) {
            console.error("Failed to fetch chats:", err.response?.status);
            setError("Failed to load chats");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChats();
    }, []);

    return { chats, loading, error, fetchChats };
}