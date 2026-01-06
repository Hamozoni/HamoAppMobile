import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import * as Contacts from "expo-contacts";
import ContactCard from "../cards/contactCard";
import ThemedSafeAreaView from "../themedViews/safeAreaView";
import ThemedViewContainer from "../themedViews/ThemedViewContainer";

export default function ContactsList({ children }) {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        (async _ => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === "granted") {
                const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
                setContacts(data);
                console.log(data.find((e) => e.name === "عمار شدة"));

            }

        })()
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
                            <ContactCard key={contact.id} contact={contact} />
                        ))
                    }

                </ThemedViewContainer>
            </ScrollView>

        </ThemedSafeAreaView>


    )
}