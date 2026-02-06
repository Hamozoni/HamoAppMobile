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

    console.log(registered)

    upsertContacts(
        registered.map((u: any) => ({
            _id: u._id,
            phoneNumber: u.phoneNumber,
            isRegistered: 1,
            countryISO: u.countryISO,
            about: u?.about,
            countryCode: u.countryCode,
            displayName: u.displayName,
            profilePicture: u?.profilePicture?.secureUrl,
        }))
    );
}

