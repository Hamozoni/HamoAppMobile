import * as Contacts from "expo-contacts/legacy";
import { normalizePhone } from "../../utils/phoneNormalize";
import { axiosInstance } from "../../lib/axios.config";
import { contactsRepository } from "../repositories/contacts.repo";
import { contacts } from "../schema";


export async function syncContacts(): Promise<void> {

    // ✅ Request permission first
    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== "granted") {
        console.log("Contacts permission denied");
        return; // exit cleanly, don't crash bootstrap
    };



    const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
    });


    const normalized: typeof contacts.$inferInsert[] = [];

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
                isInMycontacts: 1,
            });
        }
    }

    // 1. Save unregistered contacts first (don't load store yet)
    contactsRepository.createMany(normalized);

    // 2. Ask backend
    const { data: registeredFromServer } = await axiosInstance.post<typeof contacts.$inferSelect[]>(
        "/contacts/sync",
        { phoneNumbers: normalized.map(n => n.phoneNumber) }
    );

    const phoneToDisplayName = new Map(normalized.map(n => [n.phoneNumber, n.displayName]));

    const registeredContacts: typeof contacts.$inferInsert[] = registeredFromServer.map(u => ({
        ...u,
        isRegistered: 1,
        displayName: phoneToDisplayName.get(u.phoneNumber) ?? u.displayName,
        profilePicture: (u as any)?.profilePicture?.secureUrl ?? null,
    }));

    // 3. Update registered ones — NOW the DB is fully consistent
    contactsRepository.createMany(registeredContacts);

    // syncContacts resolves here, THEN AuthBootstrap calls loadContacts()
}
