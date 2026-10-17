import { create } from "zustand";
import { Chat } from "../../types/components.types";

interface ChatsState {
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    updateChat: (chatId: string, update: Partial<Chat>) => void;
    updateLastMessage: (chatId: string, lastMessage: Chat["lastMessage"]) => void;
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
                    (new Date(b.lastMessage?.createdAt).getMilliseconds()) - (new Date(a.lastMessage?.createdAt).getMilliseconds())
                ),
        })),

    updateLastMessage: (chatId, lastMessage) =>
        set(state => ({
            chats: state.chats
                .map(c => c._id === chatId ? { ...c, lastMessage } : c)
                .sort((a, b) =>
                    (new Date(b.lastMessage?.createdAt).getMilliseconds()) - (new Date(a.lastMessage?.createdAt).getMilliseconds())
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