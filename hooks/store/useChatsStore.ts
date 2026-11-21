import { create } from "zustand";
import { Chat, ChatParticipant, chats, ChatWithParticipants, Contact } from "../../db/schema";
import { getAllChats, getChatByServerId } from "../../db/repositories";
import { getChatParticipants, getParticipant } from "../../db/repositories/chatParticipants.repo";


interface ChatsState {
    chats: ChatWithParticipants[];
    currentChat: ChatWithParticipants | null;
    setCurrentChat: (chat: ChatWithParticipants | null) => void;
    setChats: (chs: ChatWithParticipants[] | []) => void;
    hydrateChtas: () => void;
    updateChat: (chatId: string, update: Partial<typeof chats.$inferInsert>) => void;
    addNewChat: (chat: ChatWithParticipants) => void;
    updateLastMessage: (chatId: string, lastMessage: Partial<ChatWithParticipants>) => void;
    incrementUnread: (chatId: string) => void;
    resetUnread: (chatId: string | undefined) => void;
}

export const useChatsStore = create<ChatsState>((set) => ({
    chats: [],

    currentChat: null,
    setCurrentChat: (chat) => set({ currentChat: chat }),

    setChats: (chats) => set({ chats }),

    hydrateChtas: async () => {

        const cachedChats = await getAllChats();

        console.log({ cachedChats })

        set({ chats: cachedChats })

    },

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