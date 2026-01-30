import * as Contacts from "expo-contacts";
import { axiosInstance } from "../../lib/axios.config";
// import { normalizePhone } from "@/utils/phoneNormalizer";
// import { ContactsRepo } from "@/db/repositories/contacts.repo";

export async function syncContacts(defaultCountry: string) {
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

    let conatcts: any[] = [];

    data.map((contact) => {
        contact.phoneNumbers?.map(numb => {
            conatcts.push({ displayName: contact.name, _id: numb?.id, phoneNumber: numb?.number })
        })
    })

    console.log(conatcts)

    //   if (!data.length) return;

    //   const now = Date.now();
    //   const normalizedSet = new Set<string>();

    //   // 3️⃣ Normalize & store locally
    //   for (const contact of data) {
    //     for (const phone of contact.phoneNumbers ?? []) {
    //       const normalized = normalizePhone(phone.number, defaultCountry);
    //       if (!normalized) continue;

    //       normalizedSet.add(normalized);

    //       await ContactsRepo.insertOrIgnore(
    //         normalized,
    //         contact.name ?? "",
    //         now
    //       );
    //     }
    //   }

    //   // 4️⃣ Send numbers to backend
    //   const phoneNumbers = Array.from(normalizedSet);
    //   if (!phoneNumbers.length) return;

    //   const { data: matches } = await axiosInstance.post("/contacts/sync", {
    //     phoneNumbers,
    //   });

    //   // matches: [{ phone, userId, displayName }]

    //   // 5️⃣ Update registered contacts locally
    //   for (const match of matches) {
    //     await ContactsRepo.markAsRegistered(
    //       match.phone,
    //       match.userId
    //     );
    //   }

    //   console.log("Contacts sync completed");
}

