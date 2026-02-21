import { create } from "zustand";
import {
    getAllContacts,
    getRegisteredContacts,
} from "../../db/repositories/contacts.repo";

interface ContactsState {
    contacts: any[];
    registered: any[];
    loadContacts: () => any;
    loadRegistered: () => any;
}

export const useContactsStore = create<ContactsState>((set) => ({

    contacts: [],
    registered: [],
    loadContacts: () => set({
        contacts: getAllContacts()
    }),
    loadRegistered: () => set({
        registered: getRegisteredContacts()
    })
}));
