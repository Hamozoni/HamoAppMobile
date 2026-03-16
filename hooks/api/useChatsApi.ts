import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios.config";
import { useChatsStore } from "../store/useChatsStore";

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
