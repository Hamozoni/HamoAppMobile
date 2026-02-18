import { create } from "zustand";
import {
    clearContacts,
    getAllContacts,
    getRegisteredContacts,
} from "../../db/repositories/contacts.repo";

interface ContactsState {
    contacts: any[];
    registered: any[];
    loading: boolean;

    loadContacts: () => Promise<void>;
}

export const useContactsStore = create<ContactsState>((set) => ({
    contacts: [],
    registered: [],
    loading: false,

    loadContacts: async () => {
        set({ loading: true });

        // await clearContacts();
        const [all, registered] = await Promise.all([
            getAllContacts(),
            getRegisteredContacts(),
        ]);

        set({
            contacts: all,
            registered,
            loading: false,
        });
    },
}));
