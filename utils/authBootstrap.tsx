import { useEffect, useRef } from "react";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { useGetProfile } from "../hooks/api/useProfileApi";
import { syncContacts } from "../db/services/syncContacts.service";
import { useContactsStore } from "../hooks/store/useContactsStore";

export function AuthBootstrap() {

    const syncedRef = useRef(false);

    const { mutateAsync: getProfile } = useGetProfile();
    const loadContacts = useContactsStore(state => state.loadContacts)
    const loadRegistered = useContactsStore(state => state.loadRegistered)

    useEffect(() => {
        if (syncedRef.current) return;
        syncedRef.current = true;

        async function syncUser() {
            syncContacts()
            try {
                const user = await getProfile();
                await useAuthStore.getState().setUser(user);
                loadContacts();
                loadRegistered()
            } catch {
                // offline / token expired → handled elsewhere
            }
        }

        syncUser();
    }, []);

    return null;
}
