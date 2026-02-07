import { ScrollView, View } from "react-native";
import ContactCard from "../cards/contactCard";
import ThemedSafeAreaView from "../themedViews/safeAreaView";
import ThemedViewContainer from "../themedViews/ThemedViewContainer";
import { useContactsStore } from "../../hooks/store/useContactsStore";

interface ContactsListProps {
    children?: React.ReactNode;
}

export default function ContactsList({ children }: ContactsListProps) {

    const { contacts, registered, loading } = useContactsStore();

    console.log(registered)
    console.log(contacts[0])

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
                            <ContactCard key={(contact as any)._id} contact={contact as any} />
                        ))
                    }
                </ThemedViewContainer>
            </ScrollView>
        </ThemedSafeAreaView>
    );
}
