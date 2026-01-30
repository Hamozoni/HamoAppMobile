import * as Contacts from "expo-contacts";

export async function syncContacts(defaultCountry: string = "SD") {

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
            conatcts.push({ displayName: contact.name, _id: numb?.id, phoneNumber: numb?.number })
        })
    })



    const phoneNumbers = conatcts.map(({ phoneNumber }) => phoneNumber)

    const d = {
        phoneNumbers,
        Contacts
    }

    return d
}

