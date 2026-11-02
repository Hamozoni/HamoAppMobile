import { create } from "zustand";
import { contactsRepository } from "../../db/repositories";
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
        const registered = await contactsRepository.findRegistered();
        const unregistered = await contactsRepository.findUnRegistered();
        set({ registered, unregistered });
    },
    setIsSyncing: (val) => set({ isSyncing: val }),
}));

