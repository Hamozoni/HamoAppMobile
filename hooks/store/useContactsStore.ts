import { create } from "zustand";
import { getRegisteredContacts, getUnregisteredContacts } from "../../db/repositories/contacts.repo";
import { Contact } from "../../db/types/contact.type";

interface ContactsState {
    registered: Contact[];
    unregistered: Contact[];
    isSyncing: boolean;
    loadContacts: () => void;
    setIsSyncing: (val: boolean) => void;
}

export const useContactsStore = create<ContactsState>((set) => ({
    registered: [],
    unregistered: [],
    isSyncing: false,
    loadContacts: () => {
        const registered = getRegisteredContacts();
        const registeredPhones = new Set(registered.map(c => c.phoneNumber));
        const unregistered = getUnregisteredContacts().filter(
            c => !registeredPhones.has(c.phoneNumber)
        );
        set({ registered, unregistered });
    },
    setIsSyncing: (val) => set({ isSyncing: val }),
}));

