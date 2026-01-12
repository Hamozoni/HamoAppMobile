import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import * as Contacts from "expo-contacts";
import ContactCard from "../cards/contactCard";
import ThemedSafeAreaView from "../themedViews/safeAreaView";
import ThemedViewContainer from "../themedViews/ThemedViewContainer";

interface ContactsListProps {
    children?: React.ReactNode;
}

export default function ContactsList({ children }: ContactsListProps) {
    const [contacts, setContacts] = useState<Contacts.Contact[]>([]);

    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === "granted") {
                const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
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
