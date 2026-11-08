import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator } from "react-native";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { useContactsStore } from "../hooks/store/useContactsStore";
import { useChatsStore } from "../hooks/store/useChatsStore";
import { syncContacts } from "../db/services/syncContacts.service";
import { axiosInstance } from "../lib/axios.config";
import { IUser } from "../types/user.type";
import { socketService } from "../services/socket.service";
import { runMigrations } from "../db/runMigration";
import { Chat } from "../types/components.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { clearUserData, resetDatabase } from "../db/maintenance";



export function AuthBootstrap() {
    const [ready, setReady] = useState(false);

    const user = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);
    const hydrate = useAuthStore((s) => s.hydrate);
    const clearUser = useAuthStore((s) => s.clearUser);

    const loadContacts = useContactsStore((s) => s.loadContacts);
    const setIsSyncing = useContactsStore((s) => s.setIsSyncing);
    // const hydrateChtas = useChatsStore(e => e.hydrateChtas)
    useEffect(() => {
        let cancelled = false;

        async function bootstrap() {
            try {
                await hydrate();
                const token = await SecureStore.getItemAsync("accessToken");
                clearUserData()
                await resetDatabase()
                await runMigrations()
                if (!token) return; // not logged in -> falls through to login redirect

                // Validate session / get fresh profile

                const cachedUser = await AsyncStorage.getItem("cachedUser");

                if (!cachedUser) {
                    const { data } = await axiosInstance.get<IUser>("/profile");
                    if (cancelled) return;
                    setUser(data);
                    console.log("USER", data);
                };

                hydrate();
                // hydrateChtas()
                socketService.connect(token);
                const { data: chatData } = await axiosInstance.get("/chats");
                if (cancelled) return;

                console.log("CHATS DATA", chatData.chats[0].participants);

                // const formatedChats = chatData.chats.map((chat: Chat) => {
                //     return {
                //         ...chat,
                //         clientChatId: Crypto.randomUUID(),
                //         createdAt: new Date(chat?.createdAt ?? 0).getMilliseconds(),
                //         updatedAt: new Date(chat?.updatedAt ?? 0).getMilliseconds(),
                //         unreadCount: chat.unreadCount[JSON.parse(cachedUser || "")._id ?? ""] ?? 0
                //     }
                // });

                // await chatsRepository.createMany(formatedChats)



                // hydrateChtas();

                setIsSyncing(true);
                await syncContacts();
                loadContacts();
            } catch (e: any) {
                console.log("THE ERROR IS HERE", e)
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

    if (!ready) return <ActivityIndicator style={{ flex: 1 }} />;

    return <Redirect href={user ? "/(tabs)/chats" : "/(auth)/login"} />;
};