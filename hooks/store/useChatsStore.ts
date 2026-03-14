import { create } from "zustand";
import { IChat } from "../api/useChatsApi";

interface ChatsState {
    chats: IChat[];
    setChats: (chats: IChat[]) => void;
    updateLastMessage: (chatId: string, lastMessage: IChat["lastMessage"]) => void;
    incrementUnread: (chatId: string) => void;
    resetUnread: (chatId: string) => void;
}

export const useChatsStore = create<ChatsState>((set) => ({
    chats: [],

    setChats: (chats) => set({ chats }),

    updateLastMessage: (chatId, lastMessage) =>
        set(state => ({
            chats: state.chats
                .map(c => c._id === chatId ? { ...c, lastMessage } : c)
                // ✅ re-sort by newest
                .sort((a, b) => {
                    const at = a.lastMessage?.rawTime ?? 0;
                    const bt = b.lastMessage?.rawTime ?? 0;
                    return bt - at;
                }),
        })),

    incrementUnread: (chatId) =>
        set(state => ({
            chats: state.chats.map(c =>
                c._id === chatId
                    ? { ...c, unreadCount: c.unreadCount + 1 }
                    : c
            ),
        })),

    resetUnread: (chatId) =>
        set(state => ({
            chats: state.chats.map(c =>
                c._id === chatId ? { ...c, unreadCount: 0 } : c
            ),
        })),
}));