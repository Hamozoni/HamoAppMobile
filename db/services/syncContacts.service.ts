import * as Contacts from "expo-contacts/legacy";
import { normalizePhone } from "../../utils/phoneNormalize";
import { axiosInstance } from "../../lib/axios.config";
import { Contact, contacts } from "../schema";
import { upsertManyContacts } from "../repositories";


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


    const normalized: Contact[] = [];

    for (const c of data) {

        for (const p of c.phoneNumbers ?? []) {
            const phoneNumber = normalizePhone(p.number ?? "", p.countryCode ?? "SA");
            if (!phoneNumber || normalized.some(n => n.phoneNumber === phoneNumber)) continue;
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



    // 2. Ask backend
    const { data: registeredFromServer } = await axiosInstance.post<typeof contacts.$inferSelect[]>(
        "/contacts/sync",
        { phoneNumbers: normalized.map(n => n.phoneNumber) }
    );

    const phoneToDisplayName = new Map(normalized.map(n => [n.phoneNumber, n.displayName]));

    const registeredContacts: Contact[] = registeredFromServer.map(u => ({
        ...u,
        isRegistered: 1,
        displayName: phoneToDisplayName.get(u.phoneNumber) ?? u.displayName,
        profilePicture: (u as any)?.profilePicture?.secureUrl ?? null,
    }));


    const allContacts: Contact[] = normalized.flatMap((c) => {
        const registeredContact = registeredContacts.find(r => r.phoneNumber === c.phoneNumber);
        if (!!registeredContact) {
            return registeredContact
        } else {
            return c;
        }
    })
    await upsertManyContacts(allContacts)
}
