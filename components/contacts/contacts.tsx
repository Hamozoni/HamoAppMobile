import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import * as Contacts from "expo-contacts";
import ContactCard from "../cards/contactCard";
import ThemedSafeAreaView from "../themedViews/safeAreaView";
import ThemedViewContainer from "../themedViews/ThemedViewContainer";
import { useGetContacts } from "../../hooks/api/useContactsApi";
import { useAuthStore } from "../../hooks/store/useAuthStore";
import * as Localization from "expo-localization";

interface ContactsListProps {
    children?: React.ReactNode;
}

export default function ContactsList({ children }: ContactsListProps) {
    const { mutateAsync: getContacts } = useGetContacts();
    const [contacts, setContacts] = useState<Contacts.Contact[]>([]);

    const user = useAuthStore((state: any) => state.user);

    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === "granted") {
                const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] })
                function normalize(phone: string) {
                    return phone
                        .replace(/\s/g, "")
                        .replace(/-/g, "")
                        .replace(/\(/g, "")
                        .replace(/\)/g, "");
                }
                console.log(data
                    .flatMap(c => c.phoneNumbers ?? [])
                    .map(p => normalize(p.number))
                    .filter(Boolean));


                // const contacts = await getContacts([data.map((contact) => contact.phoneNumbers?.[0].number)]);
                // console.log(contacts);
                setContacts(data);
            }
        })();
    }, []);

    return (
        <ThemedSafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: 10,
                    }}
                >
                    {children}
                </View>
                <ThemedViewContainer >
                    {
                        contacts.map((contact) => (
                            <ContactCard key={(contact as any).id} contact={contact as any} />
                        ))
                    }
                </ThemedViewContainer>
            </ScrollView>
        </ThemedSafeAreaView>
    );
}
