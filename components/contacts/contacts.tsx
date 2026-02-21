import React, { useState, useMemo } from "react";
import {
    SectionList,
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ContactCard from "../cards/contactCard";
import ThemedSafeAreaView from "../themedViews/safeAreaView";
import { useContactsStore } from "../../hooks/store/useContactsStore";
import { Contact } from "../../db/types/contact.type";

const WA_GREEN = "#25D366";
const WA_DARK = "#075E54";
const PAGE_BG = "#F0F2F5";
const TEXT_PRIMARY = "#111B21";
const TEXT_SECONDARY = "#667781";

interface ContactsListProps {
    children?: React.ReactNode;
}

export default function ContactsList({ children }: ContactsListProps) {
    const registered = useContactsStore(state => state.registered);
    const unregistered = useContactsStore(state => state.unregistered);
    const isSyncing = useContactsStore(state => state.isSyncing);

    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return { registered, unregistered };
        const filter = (list: Contact[]) =>
            list.filter(
                c =>
                    c.displayName?.toLowerCase().includes(q) ||
                    c.phoneNumber.includes(q)
            );
        return {
            registered: filter(registered),
            unregistered: filter(unregistered),
        };
    }, [search, registered, unregistered]);

    const sections = [
        ...(filtered.registered.length > 0
            ? [{
                title: "On SudaChat",
                count: filtered.registered.length,
                type: "registered" as const,
                data: filtered.registered,
            }]
            : []),
        ...(filtered.unregistered.length > 0
            ? [{
                title: "Invite to SudaChat",
                count: filtered.unregistered.length,
                type: "invite" as const,
                data: filtered.unregistered,
            }]
            : []),
    ];

    const total = registered.length + unregistered.length;

    return (
        <ThemedSafeAreaView style={styles.safe}>

            {/* ── Search bar ── */}
            <View style={styles.searchWrapper}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={16} color={TEXT_SECONDARY} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor={TEXT_SECONDARY}
                        value={search}
                        onChangeText={setSearch}
                        returnKeyType="search"
                        clearButtonMode="while-editing" // iOS only
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch("")} hitSlop={8}>
                            <Ionicons name="close-circle" size={17} color={TEXT_SECONDARY} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <SectionList
                sections={sections}
                keyExtractor={(item: Contact, index) => `${item.phoneNumber}-${index}`}
                showsVerticalScrollIndicator={false}
                stickySectionHeadersEnabled

                ListHeaderComponent={
                    <>
                        {children ?? null}
                        {!isSyncing && total > 0 && (
                            <Text style={styles.totalLabel}>
                                {total} contact{total !== 1 ? "s" : ""}
                            </Text>
                        )}
                    </>
                }

                ListEmptyComponent={
                    isSyncing ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color={WA_GREEN} />
                            <Text style={styles.emptyLabel}>Syncing contacts…</Text>
                        </View>
                    ) : search.length > 0 ? (
                        <View style={styles.centered}>
                            <Ionicons name="search" size={44} color="#CBD5E1" />
                            <Text style={styles.emptyTitle}>No results for "{search}"</Text>
                            <Text style={styles.emptyLabel}>Try a different name or number</Text>
                        </View>
                    ) : (
                        <View style={styles.centered}>
                            <Ionicons name="people-outline" size={64} color="#CBD5E1" />
                            <Text style={styles.emptyTitle}>No contacts yet</Text>
                            <Text style={styles.emptyLabel}>
                                Contacts will appear here{"\n"}once your phone is synced
                            </Text>
                        </View>
                    )
                }

                renderSectionHeader={({ section }) => (
                    <View style={styles.sectionHeader}>
                        <View style={[
                            styles.sectionDot,
                            { backgroundColor: section.type === "registered" ? WA_GREEN : TEXT_SECONDARY }
                        ]} />
                        <Text style={[
                            styles.sectionTitle,
                            { color: section.type === "registered" ? WA_DARK : TEXT_SECONDARY }
                        ]}>
                            {section.title}
                        </Text>
                        <Text style={styles.sectionCount}>{section.count}</Text>
                    </View>
                )}

                renderItem={({ item, index, section }: any) => {
                    const isFirst = index === 0;
                    const isLast = index === section.data.length - 1;
                    return (
                        <View style={[
                            styles.cardWrapper,
                            isFirst && styles.cardFirst,
                            isLast && styles.cardLast,
                        ]}>
                            <ContactCard contact={item} />
                            {!isLast && <View style={styles.divider} />}
                        </View>
                    );
                }}

                SectionSeparatorComponent={() => <View style={styles.sectionGap} />}
                ItemSeparatorComponent={() => null} // handled manually above
                contentContainerStyle={styles.listContent}
            />
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: PAGE_BG,
    },

    // ── Search ──────────────────────────────────────
    searchWrapper: {
        backgroundColor: "#fff",
        paddingHorizontal: 0,
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E5E7EB",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: PAGE_BG,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 42,
        gap: 8,
    },
    searchIcon: {
        flexShrink: 0,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: TEXT_PRIMARY,
        paddingVertical: 0,
    },

    // ── List layout ─────────────────────────────────
    listContent: {
        paddingBottom: 40,
    },
    totalLabel: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 4,
        fontSize: 13,
        color: TEXT_SECONDARY,
        fontWeight: "500",
    },

    // ── Section header ───────────────────────────────
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 9,
        backgroundColor: PAGE_BG,
        gap: 8,
    },
    sectionDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },
    sectionTitle: {
        flex: 1,
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.5,
        textTransform: "uppercase",
    },
    sectionCount: {
        fontSize: 12,
        color: TEXT_SECONDARY,
        fontWeight: "600",
        backgroundColor: "#E5E7EB",
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 1,
    },
    sectionGap: {
        height: 16,
    },

    // ── Card container ───────────────────────────────
    cardWrapper: {
        backgroundColor: "#ffffffff",
        marginHorizontal: 0,
        overflow: "hidden",
    },
    cardFirst: {
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
    },
    cardLast: {
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#E9ECEE",
        marginLeft: 78, // indent past avatar
    },

    // ── Empty / loading ──────────────────────────────
    centered: {
        alignItems: "center",
        paddingTop: 80,
        paddingHorizontal: 40,
        gap: 10,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: TEXT_PRIMARY,
        textAlign: "center",
        marginTop: 8,
    },
    emptyLabel: {
        fontSize: 14,
        color: TEXT_SECONDARY,
        textAlign: "center",
        lineHeight: 21,
    },
});