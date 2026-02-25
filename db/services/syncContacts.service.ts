import * as Contacts from "expo-contacts";
import { normalizePhone } from "../../utils/phoneNormalize";
import { upsertContacts } from "../repositories/contacts.repo";
import { axiosInstance } from "../../lib/axios.config";
import type { Contact } from "../types/contact.type";

export async function syncContacts(): Promise<void> {

    // ✅ Request permission first
    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== "granted") {
        console.log("Contacts permission denied");
        return; // exit cleanly, don't crash bootstrap
    }

    const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
    });

    const normalized: Contact[] = [];

    for (const c of data) {
        for (const p of c.phoneNumbers ?? []) {
            const phoneNumber = normalizePhone(p.number ?? "", p.countryCode ?? "SA");
            if (!phoneNumber) continue;
            normalized.push({
                _id: c.id ?? phoneNumber,
                phoneNumber,
                countryCode: p.countryCode ?? null,
                countryISO: null,
                displayName: c.name ?? phoneNumber,
                about: null,
                profilePicture: null,
                isRegistered: 0,
            });
        }
    }

    // 1. Save unregistered contacts first (don't load store yet)
    upsertContacts(normalized);

    // 2. Ask backend
    const { data: registeredFromServer } = await axiosInstance.post<Contact[]>(
        "/contacts/sync",
        { phoneNumbers: normalized.map(n => n.phoneNumber) }
    );

    const phoneToDisplayName = new Map(normalized.map(n => [n.phoneNumber, n.displayName]));

    const registeredContacts: Contact[] = registeredFromServer.map(u => ({
        ...u,
        isRegistered: 1 as const,
        displayName: phoneToDisplayName.get(u.phoneNumber) ?? u.displayName,
        profilePicture: (u as any)?.profilePicture?.secureUrl ?? null,
    }));

    // 3. Update registered ones — NOW the DB is fully consistent
    upsertContacts(registeredContacts);

    // syncContacts resolves here, THEN AuthBootstrap calls loadContacts()
}
