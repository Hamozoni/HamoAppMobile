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
            const e164 = normalizePhone(p.number, p.countryCode || "SA");
            if (!e164) continue;

            normalized.push({
                _id: `${c.id}_${e164}`,
                phoneNumber: p.number,
                phoneE164: e164,
                countryISO: p.countryCode,
                displayName: c.name,
                isRegistered: false,
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
            _id: u.contactId,
            phoneE164: u.phoneE164,
            isRegistered: true,
            userId: u._id,
            profilePicture: u?.profilePicture?.secureUrl,
        }))
    );
}

