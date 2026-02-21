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

                // ✅ Do NOT use Promise.all here — sync must finish before load
                const user = await getProfile();
                await useAuthStore.getState().setUser(user);

                await syncContacts(); // wait for BOTH upserts to complete

                loadContacts(); // now DB has correct isRegistered values
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
