import { useEffect, useRef, useState } from "react";
import { Redirect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { syncContacts } from "../db/services/syncContacts.service";
import { useContactsStore } from "../hooks/store/useContactsStore";
import { runMigrations } from "../db/runMigration";
import notificationService from "../services/notification.service";
import { axiosInstance } from "../lib/axios.config";
import { ActivityIndicator } from "react-native";
import { useGetProfile } from "../hooks/api/useProfileApi";
import { IUser } from "../types/user.type";
import { useChatsStore } from "../hooks/store/useChatsStore";

export function AuthBootstrap() {

    const syncedRef = useRef(false);
    const { loadContacts, setIsSyncing } = useContactsStore();
    const { setChats } = useChatsStore();
    const user = useAuthStore(st => st.user);
    const hydrated = useAuthStore(st => st.hydrated);
    const setUser = useAuthStore(st => st.setUser);
    const hydrate = useAuthStore(st => st.hydrate);
    const [isUser, setIsUer] = useState<boolean>(false);



    const { data: userData } = useGetProfile(isUser);

    useEffect(() => {

        if (syncedRef.current) return;

        syncedRef.current = true;

        async function bootstrap() {
            try {

                await hydrate();
                const accessToken = await SecureStore.getItemAsync('accessToken');

                if (!user && accessToken) {
                    setIsUer(true)
                    setUser(userData as IUser)

                };

                if (!accessToken) return
                // ✅ 2. Run migrations before any DB operations

                const { data: chatData } = await axiosInstance.get("/chats");

                console.log(chatData.chats[0]?.participants)

                setChats(chatData.chats)
                await runMigrations();

                setIsSyncing(true);


                // try {

                //     // ✅ 4. Register push token after login
                //     const token = await notificationService.registerPushToken();
                //     if (token) {
                //         await axiosInstance.post("/profile/push-token", { token });
                //     }

                //     // ✅ 5. Handle notification taps
                //     notificationService.addNotificationResponseListener((chatId, phoneNumber) => {
                //         router.push({
                //             pathname: "/chats/[phoneNumber]",
                //             params: { phoneNumber },
                //         } as any);
                //     });


                // } catch (profileError: any) {
                //     console.log("No active session:", profileError.message);

                //     await SecureStore.deleteItemAsync("accessToken");
                //     await SecureStore.deleteItemAsync("refreshToken");
                //     await useAuthStore.getState().clearUser();
                //     router.replace("/(auth)/login");
                //     return;
                // }

                // ✅ 6. Sync contacts after profile loaded
                await syncContacts();
                loadContacts();

            } catch (e) {
                console.error("Bootstrap failed:", e);
            } finally {
                setIsSyncing(false);
            }
        }

        bootstrap();
    }, []);

    if (!hydrated) return <ActivityIndicator />;

    if (!user) {
        console.log("No user found!");
        return <Redirect href="/(auth)/login" />;
    }

    console.log(user, "User found!");
    return <Redirect href="/(tabs)/chats" />;
}
