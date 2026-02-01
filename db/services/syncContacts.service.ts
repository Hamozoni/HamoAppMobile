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
            userId: u.userId,
            profilePicture: u.profilePicture,
        }))
    );
}


// export async function syncContacts() {

//     const normalizePhone = (raw: string, defaultCountryISO: string): string | null => {

//         const phone = parsePhoneNumberFromString(raw, defaultCountryISO as any);

//         if (!phone || !phone.isValid()) return null;

//         return phone.number; // E.164 → +249912345678

//     };

//     // 1️⃣ Permission
//     const { status } = await Contacts.requestPermissionsAsync();
//     if (status !== "granted") {
//         console.log("Contacts permission denied");
//         return;
//     }

//     // 2️⃣ Read device contacts
//     const { data } = await Contacts.getContactsAsync({
//         fields: [Contacts.Fields.PhoneNumbers],
//     });

//     const conatcts: any[] = [];

//     data.map((contact) => {
//         contact.phoneNumbers?.map(numb => {
//             if (!numb?.number) return;
//             conatcts.push({ displayName: contact.name, _id: numb?.id, phoneNumber: normalizePhone(numb?.number || "", "SA"), isRequested: false })
//         })
//     })



//     const phoneNumbers = conatcts.map(({ phoneNumber }) => phoneNumber)


//     const { data: requestedContacts } = await axiosInstance.post('/contacts/sync', { phoneNumbers, countryISO: "SA" });
//     let myContacts: any[] = []
//     conatcts.map((contact) => {
//         requestedContacts.map((requestedContact: any) => {
//             if (contact.phoneNumber == requestedContact.phoneNumber) {
//                 myContacts.push({ ...requestedContact, isRequested: true })
//             }
//             else {
//                 myContacts.push(contact)
//             }

//         })
//     })
// }

