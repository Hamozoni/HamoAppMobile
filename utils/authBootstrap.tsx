import { useEffect, useRef } from "react";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { useGetProfile } from "../hooks/api/useProfileApi";
import { syncContacts } from "../db/services/syncContacts.service";
import { useContactsStore } from "../hooks/store/useContactsStore";

export function AuthBootstrap() {

    const syncedRef = useRef(false);

    const { mutateAsync: getProfile } = useGetProfile();

    useEffect(() => {
        if (syncedRef.current) return;
        syncedRef.current = true;

        async function syncUser() {
            try {
                const user = await getProfile();
                await useAuthStore.getState().setUser(user);
            } catch {
                // offline / token expired → handled elsewhere
            }
        }
        syncContacts().then(() => {
            useContactsStore.getState().loadContacts()
        });

        syncUser();
    }, []);

    return null;
}
