import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { useGetProfile } from "../hooks/api/useProfileApi";
import { syncContacts } from "../db/services/syncContacts.service";
import { useContactsStore } from "../hooks/store/useContactsStore";
import { runMigrations } from "../db/runMigration";
import { onAuthFailed } from "./authEvents";
import { getDatabase } from "../db";
import notificationService from "../services/notification.service";
import { axiosInstance } from "../lib/axios.config";

export function AuthBootstrap() {

    const syncedRef = useRef(false);
    const { mutateAsync: getProfile } = useGetProfile();
    const { loadContacts, setIsSyncing } = useContactsStore();
    const router = useRouter();

    useEffect(() => {
        if (syncedRef.current) return;
        syncedRef.current = true;
        async function bootstrap() {
            try {
                // ✅ 1. Hydrate FIRST — unblocks the Index screen spinner
                await useAuthStore.getState().hydrate();
                runMigrations()
                setIsSyncing(true);
                // ✅ Separate try/catch for profile — auth failure is expected when logged out
                let user = null;
                try {
                    user = await getProfile();
                    await useAuthStore.getState().setUser(user);
                    // After successful login:
                    const token = await notificationService.registerPushToken();
                    if (token) {
                        // ✅ Save token to server
                        await axiosInstance.post("/profile/push-token", { token });
                    };

                    // ✅ Handle notification taps — navigate to chat
                    notificationService.addNotificationResponseListener((chatId, phoneNumber) => {
                        router.push({
                            pathname: "/chats/[phoneNumber]",
                            params: { phoneNumber },
                        } as any);
                    });

                } catch (profileError: any) {

                    console.log("No active session:", profileError.message);
                    onAuthFailed(async () => {
                        await SecureStore.deleteItemAsync("accessToken");
                        await SecureStore.deleteItemAsync("refreshToken");
                        await useAuthStore.getState().clearUser();

                        router.replace("/(auth)/login")
                    });
                    return;
                }

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

    return null;
}
