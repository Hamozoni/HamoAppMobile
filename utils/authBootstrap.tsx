import { useEffect, useRef } from "react";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { useGetProfile } from "../hooks/api/useProfileApi";
import { syncContacts } from "../db/services/syncContacts.service";
import { useContactsStore } from "../hooks/store/useContactsStore";
import { clearContacts } from "../db/repositories/contacts.repo";

export function AuthBootstrap() {

    const syncedRef = useRef(false);
    const { mutateAsync: getProfile } = useGetProfile();
    const { loadContacts, setIsSyncing } = useContactsStore();

    useEffect(() => {
        if (syncedRef.current) return;
        syncedRef.current = true;
        async function bootstrap() {
            try {
                setIsSyncing(true);
                clearContacts();

                // ✅ Separate try/catch for profile — auth failure is expected when logged out
                let user = null;
                try {
                    user = await getProfile();
                    await useAuthStore.getState().setUser(user);
                } catch (profileError: any) {
                    // No valid session → emitAuthFailed already fired from interceptor
                    // Just stop bootstrap cleanly, don't crash
                    console.log("No active session:", profileError.message);
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
