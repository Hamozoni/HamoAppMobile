import { SectionList, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import ContactCard from "../cards/contactCard";
import ThemedSafeAreaView from "../themedViews/safeAreaView";
import { useContactsStore } from "../../hooks/store/useContactsStore";
import { Contact } from "../../db/types/contact.type";

interface ContactsListProps {
    children?: React.ReactNode;
}

export default function ContactsList({ children }: ContactsListProps) {
    const registered = useContactsStore(state => state.registered);
    const unregistered = useContactsStore(state => state.unregistered);
    const isSyncing = useContactsStore(state => state.isSyncing);

    const sections = [
        ...(registered.length > 0
            ? [{ title: "Contacts on SudaChat", data: registered }]
            : []
        ),
        ...(unregistered.length > 0
            ? [{ title: "Invite to SudaChat", data: unregistered }]
            : []
        ),
    ];

    return (
        <ThemedSafeAreaView>
            <SectionList
                sections={sections}
                keyExtractor={(item: Contact, index) => `${item.phoneNumber}-${index}`}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={children ? <View>{children}</View> : null}
                ListEmptyComponent={
                    isSyncing
                        ? <ActivityIndicator style={styles.loader} />
                        : <Text style={styles.empty}>No contacts found</Text>
                }
                renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                )}
                renderItem={({ item }: { item: Contact }) => (
                    <ContactCard contact={item} />
                )}
                SectionSeparatorComponent={() => <View style={styles.separator} />}
            // staleWhileRevalidate
            />
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 14,
        fontWeight: "600",
        backgroundColor: "#f2f2f2",
    },
    separator: {
        height: 8,
        backgroundColor: "#f2f2f2",
    },
    loader: {
        marginTop: 40,
    },
    empty: {
        textAlign: "center",
        marginTop: 40,
        color: "#999",
        fontSize: 14,
    },
});