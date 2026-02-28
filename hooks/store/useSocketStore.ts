import { create } from "zustand";
import socketService from "../../services/socket.service";

interface SocketState {
    isConnected: boolean;
    typingUsers: Map<string, Set<string>>; // chatId → Set<userId>

    connect: () => Promise<void>;
    disconnect: () => void;
    reconnect: () => Promise<void>;
    setConnected: (val: boolean) => void;
    setUserTyping: (chatId: string, userId: string, isTyping: boolean) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({

    isConnected: false,
    typingUsers: new Map(),

    connect: async () => {
        await socketService.connect();
        set({ isConnected: socketService.isConnected() });
    },

    disconnect: () => {
        socketService.disconnect();
        set({ isConnected: false });
    },

    reconnect: async () => {
        await socketService.reconnect();
        set({ isConnected: socketService.isConnected() });
    },

    setConnected: (val) => set({ isConnected: val }),

    setUserTyping: (chatId, userId, isTyping) => {
        set(state => {
            const map = new Map(state.typingUsers);
            if (!map.has(chatId)) map.set(chatId, new Set());
            const users = new Set(map.get(chatId)!);
            isTyping ? users.add(userId) : users.delete(userId);
            map.set(chatId, users);
            return { typingUsers: map };
        });
    },

}));