import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator } from "react-native";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { useContactsStore } from "../hooks/store/useContactsStore";
import { useChatsStore } from "../hooks/store/useChatsStore";
import { syncContacts } from "../db/services/syncContacts.service";
import { runMigrations } from "../db/runMigration";
import { axiosInstance } from "../lib/axios.config";
import { IUser } from "../types/user.type";

export function AuthBootstrap() {
    const [ready, setReady] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const user = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);
    const hydrate = useAuthStore((s) => s.hydrate);
    const clearUser = useAuthStore((s) => s.clearUser);

    const loadContacts = useContactsStore((s) => s.loadContacts);
    const setIsSyncing = useContactsStore((s) => s.setIsSyncing);
    const setChats = useChatsStore((s) => s.setChats);

    useEffect(() => {
        let cancelled = false;

        async function bootstrap() {
            try {
                await hydrate();
                const token = await SecureStore.getItemAsync("accessToken");
                setAccessToken(token);

                if (!token) return; // not logged in -> falls through to login redirect

                // Validate session / get fresh profile
                if (!useAuthStore.getState().user) {
                    const { data } = await axiosInstance.get<IUser>("/profile");
                    if (cancelled) return;
                    setUser(data);
                }

                await runMigrations();

                const { data: chatData } = await axiosInstance.get("/chats");
                if (cancelled) return;
                setChats(chatData.chats);

                setIsSyncing(true);
                await syncContacts();
                loadContacts();
            } catch (e: any) {
                console.error("Bootstrap failed:", e?.message);
                if (e?.response?.status === 401) {
                    await SecureStore.deleteItemAsync("accessToken");
                    await SecureStore.deleteItemAsync("refreshToken");
                    await clearUser();
                }
            } finally {
                setIsSyncing(false);
                if (!cancelled) setReady(true);
            }
        }

        bootstrap();
        return () => {
            cancelled = true;
        };
    }, []);

    console.log("user", user);
    console.log("accessToken", accessToken);
    console.log("ready", ready);

    if (!ready) return <ActivityIndicator style={{ flex: 1 }} />;

    return <Redirect href={user ? "/(tabs)/chats" : "/(auth)/login"} />;
};