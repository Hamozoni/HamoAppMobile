import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import * as Contacts from "expo-contacts";
import ContactCard from "../cards/contactCard";
import ThemedSafeAreaView from "../themedViews/safeAreaView";
import ThemedViewContainer from "../themedViews/ThemedViewContainer";
import { useGetContacts } from "../../hooks/api/useContactsApi";
import { useAuthStore } from "../../hooks/store/useAuthStore";
import { IUser } from "../../types/user.type";

interface ContactsListProps {
    children?: React.ReactNode;
}

export default function ContactsList({ children }: ContactsListProps) {
    const { mutateAsync: getContacts } = useGetContacts();
    const [contacts, setContacts] = useState<Contacts.Contact[]>([]);

    const [myContacts, setMyContacts] = useState<IUser[]>([]);

    const user = useAuthStore((state: any) => state.user);


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
