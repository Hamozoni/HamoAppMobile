import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { useGetProfile } from "../hooks/api/useProfileApi";
import { syncContacts } from "../db/services/syncContacts.service";
import { useContactsStore } from "../hooks/store/useContactsStore";
import { runMigrations } from "../db/runMigration";
import { onAuthFailed } from "./authEvents";
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
                // ✅ 1. Hydrate token first
                await useAuthStore.getState().hydrate();

                // ✅ 2. Run migrations before any DB operations
                await runMigrations();

                setIsSyncing(true);

                // ✅ 3. Get profile
                let user = null;
                try {
                    user = await getProfile();
                    await useAuthStore.getState().setUser(user);

                    // ✅ 4. Register push token after login
                    const token = await notificationService.registerPushToken();
                    if (token) {
                        await axiosInstance.post("/profile/push-token", { token });
                    }

                    // ✅ 5. Handle notification taps
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
                        router.replace("/(auth)/login");
                    });
                    return;
                }

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

    return null;
}
