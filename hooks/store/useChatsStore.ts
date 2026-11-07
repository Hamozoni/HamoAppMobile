import { create } from "zustand";
import { chats } from "../../db/schema";


interface ChatsState {
    chats: typeof chats.$inferInsert[] | [];
    currentChatId: string | null;
    setCurrentChatId: (chatId: string | null) => void;
    setChats: (chs: typeof chats.$inferInsert[] | []) => void;
    // hydrateChtas: () => void;
    updateChat: (chatId: string, update: Partial<typeof chats.$inferInsert>) => void;
    addNewChat: (chat: typeof chats.$inferInsert) => void;
    updateLastMessage: (chatId: string, lastMessage: Partial<typeof chats.$inferInsert>) => void;
    incrementUnread: (chatId: string) => void;
    resetUnread: (chatId: string | undefined) => void;
}

export const useChatsStore = create<ChatsState>((set) => ({
    chats: [],

    currentChatId: null,
    setCurrentChatId: (chatId) => set({ currentChatId: chatId }),

    setChats: (chats) => set({ chats }),

    // hydrateChtas: async () => {

    //     const cachedChats = await chatsRepository.findAll();

    //     set({ chats: cachedChats })

    // },

    updateChat: (chatId, update) =>
        set(state => ({
            chats: state.chats
                .map(c => c._id === chatId ? { ...c, ...update } : c)
                .sort((a, b) =>
                    ((a.lastMessageAt ?? 0) - (b.lastMessageAt ?? 0))
                ),
        })),

    addNewChat: (chat) =>
        set(state => ({
            chats: [chat, ...state.chats]
                .sort((a, b) =>
                    ((a.lastMessageAt ?? 0) - (b.lastMessageAt ?? 0))
                ),
        })),


    updateLastMessage: (chatId, lastMessage) =>
        set(state => ({
            chats: state.chats
                .map(c => c._id === chatId ? { ...c, ...lastMessage } : c)
                .sort((a, b) =>
                    ((a.lastMessageAt ?? 0) - (b.lastMessageAt ?? 0))
                ),
        })),

    incrementUnread: (chatId) =>
        set(state => ({
            chats: state.chats.map(c =>
                c._id === chatId
                    ? { ...c, unreadCount: (c.unreadCount ?? 0) + 1 }
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