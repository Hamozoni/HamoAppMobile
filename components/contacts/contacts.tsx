import { ScrollView, Text, View } from "react-native";
import ContactCard, { ContactCardProps } from "../cards/contactCard";
import ThemedSafeAreaView from "../themedViews/safeAreaView";
import ThemedViewContainer from "../themedViews/ThemedViewContainer";
import { useContactsStore } from "../../hooks/store/useContactsStore";
import Separator from "../ui/separator";

interface ContactsListProps {
    children?: React.ReactNode;
}

export default function ContactsList({ children }: ContactsListProps) {

    const { contacts, registered, loading } = useContactsStore();

    if (loading) {
        return <Text>Loading...</Text>
    }

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
                <View >
                    {
                        registered?.length > 0 &&
                        <>
                            <Separator />
                            <Text style={{ padding: 15, fontSize: 14, fontWeight: 600 }}>
                                Contacts on SudaChat
                            </Text>
                            <ThemedViewContainer>
                                {
                                    registered?.map((contact: ContactCardProps) => (
                                        <ContactCard key={contact._id} contact={contact} />
                                    ))

                                }
                            </ThemedViewContainer>
                            <Separator />
                        </>

                    }
                    <>
                        <Text style={{ padding: 15, fontSize: 14, fontWeight: 600 }}>
                            Invite to SudaChat
                        </Text>

                        <ThemedViewContainer>
                            {
                                contacts.map((contact: ContactCardProps) => (
                                    <ContactCard key={(contact as any)._id} contact={contact as any} />
                                ))
                            }

                        </ThemedViewContainer>
                    </>
                </View>
            </ScrollView>
        </ThemedSafeAreaView>
    );
}
