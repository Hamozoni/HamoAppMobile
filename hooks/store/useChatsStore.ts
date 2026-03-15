import { create } from "zustand";
import { IChat } from "../api/useChatsApi";

interface ChatsState {
    chats: IChat[];
    setChats: (chats: IChat[]) => void;
    updateChat: (chatId: string, update: Partial<IChat>) => void;
    updateLastMessage: (chatId: string, lastMessage: IChat["lastMessage"]) => void;
    incrementUnread: (chatId: string) => void;
    resetUnread: (chatId: string) => void;
}

export const useChatsStore = create<ChatsState>((set) => ({
    chats: [],

    setChats: (chats) => set({ chats }),

    updateChat: (chatId, update) =>
        set(state => ({
            chats: state.chats
                .map(c => c._id === chatId ? { ...c, ...update } : c)
                .sort((a, b) =>
                    (b.lastMessage?.rawTime ?? 0) - (a.lastMessage?.rawTime ?? 0)
                ),
        })),

    updateLastMessage: (chatId, lastMessage) =>
        set(state => ({
            chats: state.chats
                .map(c => c._id === chatId ? { ...c, lastMessage } : c)
                .sort((a, b) =>
                    (b.lastMessage?.rawTime ?? 0) - (a.lastMessage?.rawTime ?? 0)
                ),
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