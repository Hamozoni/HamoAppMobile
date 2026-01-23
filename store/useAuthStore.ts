// store/useAuthStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../types/user.type";

interface AuthState {
    user: IUser | null;
    hydrated: boolean;

    setUser: (user: IUser) => Promise<void>;
    clearUser: () => Promise<void>;
    hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    hydrated: false,

    setUser: async (user) => {
        await AsyncStorage.setItem("cachedUser", JSON.stringify(user));
        set({ user });
    },

    clearUser: async () => {
        await AsyncStorage.removeItem("cachedUser");
        set({ user: null });
    },

    hydrate: async () => {
        const cached = await AsyncStorage.getItem("cachedUser");
        if (cached) {
            set({ user: JSON.parse(cached), hydrated: true });
        } else {
            set({ hydrated: true });
        }
    },
}));
