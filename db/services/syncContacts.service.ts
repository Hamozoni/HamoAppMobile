import * as Contacts from "expo-contacts";
import { normalizePhone } from "../../utils/phoneNormalize";
import { upsertContacts } from "../repositories/contacts.repo";
import { axiosInstance } from "../../lib/axios.config";


export async function syncContacts() {

    const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
    });

    const normalized: any[] = [];

    for (const c of data) {
        for (const p of c.phoneNumbers ?? []) {
            const phoneNumber = normalizePhone(p.number, p.countryCode || "SA");
            if (!phoneNumber) continue;

            normalized.push({
                _id: c?.id,
                phoneNumber,
                countryCode: c.countryCode,
                displayName: c.name,
                isRegistered: 0,
                profilePicture: null,
            });
        }
    }

    upsertContacts(normalized);
    // Send to backend
    const { data: registered } = await axiosInstance.post("/contacts/sync", {
        phoneNumbers: normalized.map(n => n.phoneNumber),
    });


    upsertContacts(
        registered.map((u: any) => ({
            _id: u._id,
            about: u?.about,
            isRegistered: 1,
            countryCode: u?.countryCode,
            countryISO: u?.countryISO,
            displayName: normalized.find(e => e.phoneNumber === u.phoneNumber)?.displayName,
            profilePicture: u?.profilePicture?.secureUrl,
            phoneNumber: u.phoneNumber
        }))
    );
}

