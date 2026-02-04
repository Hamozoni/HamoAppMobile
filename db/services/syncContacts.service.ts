import * as Contacts from "expo-contacts";
import { normalizePhone } from "../../utils/phoneNormalize";
import { upsertContacts } from "../repositories/contacts.repo";
import { axiosInstance } from "../../lib/axios.config";

export async function syncContacts() {

    const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
    });

    console.log(data[5]);

    const normalized: any[] = [];

    for (const c of data) {
        for (const p of c.phoneNumbers ?? []) {
            const phoneNumber = normalizePhone(p.number, p.countryCode || "SA");
            if (!phoneNumber) continue;

            normalized.push({
                _id: c?.id,
                phoneNumber,
                countryISO: p.countryCode,
                displayName: c.name,
                isRegistered: false,
                profilePicture: null,
            });
        }
    }

    upsertContacts(normalized);

    // Send to backend
    const { data: registered } = await axiosInstance.post("/contacts/sync", {
        phoneNumbers: normalized.map(n => n.phoneE164),
    });

    upsertContacts(
        registered.map((u: any) => ({
            _id: u._d,
            phoneNumber: u.phoneNumber,
            isRegistered: true,
            countryISO: u.countryISO,
            displayName: u.displayName,
            profilePicture: u?.profilePicture?.secureUrl,
        }))
    );
}

