import { create } from "zustand";
import { ILocalMessage } from "../../types/message.types";

interface MessagesState {
    // chatId → messages
    messages: Record<string, ILocalMessage[]>;

    addMessage: (chatId: string, message: ILocalMessage) => void;
    replaceOptimistic: (chatId: string, clientMessageId: string, real: ILocalMessage) => void;
    updateMessageStatus: (chatId: string, messageId: string, status: string) => void;
    setMessages: (chatId: string, messages: ILocalMessage[]) => void;
    prependMessages: (chatId: string, messages: ILocalMessage[]) => void; // pagination
    deleteMessage: (chatId: string, messageId: string) => void;
    clearChat: (chatId: string) => void;
}

export const useMessagesStore = create<MessagesState>((set) => ({
    messages: {},

    addMessage: (chatId, message) =>
        set(state => ({
            messages: {
                ...state.messages,
                [chatId]: [message, ...(state.messages[chatId] ?? [])],
            },
        })),

    // Replace optimistic message with real one from server
    replaceOptimistic: (chatId, clientMessageId, real) =>
        set(state => ({
            messages: {
                ...state.messages,
                [chatId]: (state.messages[chatId] ?? []).map(m =>
                    m.clientMessageId === clientMessageId ? real : m
                ),
            },
        })),

    updateMessageStatus: (chatId, messageId, status) =>
        set(state => ({
            messages: {
                ...state.messages,
                [chatId]: (state.messages[chatId] ?? []).map(m =>
                    m._id === messageId ? { ...m, status } : m
                ),
            },
        })),

    setMessages: (chatId, messages) =>
        set(state => ({
            messages: { ...state.messages, [chatId]: messages },
        })),

    prependMessages: (chatId, messages) =>
        set(state => ({
            messages: {
                ...state.messages,
                [chatId]: [...(state.messages[chatId] ?? []), ...messages],
            },
        })),

    deleteMessage: (chatId, messageId) =>
        set(state => ({
            messages: {
                ...state.messages,
                [chatId]: (state.messages[chatId] ?? []).map(m =>
                    m._id === messageId ? { ...m, isDeleted: true } : m
                ),
            },
        })),

    clearChat: (chatId) =>
        set(state => ({
            messages: { ...state.messages, [chatId]: [] },
        })),
}));