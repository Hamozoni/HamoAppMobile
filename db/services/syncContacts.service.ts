import * as Contacts from "expo-contacts";
import { axiosInstance } from "../../lib/axios.config";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export async function syncContacts() {

    const normalizePhone = (raw: string, defaultCountryISO: string): string | null => {

        const phone = parsePhoneNumberFromString(raw, defaultCountryISO as any);

        if (!phone || !phone.isValid()) return null;

        return phone.number; // E.164 → +249912345678

    };

    // 1️⃣ Permission
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
        console.log("Contacts permission denied");
        return;
    }

    // 2️⃣ Read device contacts
    const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
    });

    const conatcts: any[] = [];

    data.map((contact) => {
        contact.phoneNumbers?.map(numb => {
            if (!numb?.number) return;
            conatcts.push({ displayName: contact.name, _id: numb?.id, phoneNumber: normalizePhone(numb?.number || "", "SA"), isRequested: false })
        })
    })



    const phoneNumbers = conatcts.map(({ phoneNumber }) => phoneNumber)


    const { data: requestedContacts } = await axiosInstance.post('/contacts/sync', { phoneNumbers, countryISO: "SA" });
    let myContacts: any[] = []
    conatcts.map((contact) => {
        requestedContacts.map((requestedContact: any) => {
            if (contact.phoneNumber == requestedContact.phoneNumber) {
                myContacts.push({ ...requestedContact, isRequested: true })
            }
            else {
                myContacts.push(contact)
            }

        })
    })
}

