import { create } from "zustand";
import { getRegisteredContacts, getUnRegisteredContacts } from "../../db/repositories";
import { contacts } from "../../db/schema";

interface ContactsState {
    registered: typeof contacts.$inferInsert[];
    unregistered: typeof contacts.$inferInsert[];
    isSyncing: boolean;
    loadContacts: () => void;
    setIsSyncing: (val: boolean) => void;
}

export const useContactsStore = create<ContactsState>((set) => ({
    registered: [],
    unregistered: [],
    isSyncing: false,
    loadContacts: async () => {
        const registered = await getRegisteredContacts();
        const unregistered = await getUnRegisteredContacts();
        set({ registered, unregistered });
    },
    setIsSyncing: (val) => set({ isSyncing: val }),
}));

