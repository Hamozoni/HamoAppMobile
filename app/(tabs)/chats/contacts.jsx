import { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import * as Contacts from "expo-contacts";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ContactsPage() {

    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === "granted") {
                const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
                setContacts(data);
                console.log(data[10].phoneNumbers);

            }

        })()
    }, []);
    return (
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1, paddingHorizontal: 10 }}>
                <View>
                    <TouchableOpacity>
                        <Ionicons name="people-outline" size={26} color="black" />
                        <Text>New Group</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="person-add-outline" size={26} color="black" />
                        <Text>New Contact</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="people-outline" size={26} color="black" />
                        <Text>New Community</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="megaphone-outline" size={26} color="black" />
                        <Text>New broadcast</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}