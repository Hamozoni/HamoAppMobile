import React from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { RoundedBtn } from "../../../components/buttons/roundedBtn";
import { CALLS } from "../../../constants/call";
import { CallCard } from "../../../components/cards/callCard";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const WA_GREEN = "#25D366";
const PAGE_BG = "#F0F2F5";
const TEXT_PRIMARY = "#111B21";
const TEXT_SECONDARY = "#667781";

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface CallBtnItem {
    id: number;
    iconName: IoniconsName;
    title: string;
    link: string;
    color?: string;
}

const CALLSBTN: CallBtnItem[] = [
    { id: 1, iconName: "call-outline", title: "Call", link: "/calls/call" },
    { id: 2, iconName: "calendar-outline", title: "Schedule", link: "/calls/schedule" },
    { id: 3, iconName: "keypad-outline", title: "Keypad", link: "/calls/keypad" },
    { id: 4, iconName: "heart-outline", title: "Favorites", link: "/calls/favorites", color: "#FF3B30" },
];

const Calls = () => {
    const router = useRouter();

    return (
        <ThemedSafeAreaView >
            <FlatList
                data={CALLS}
                renderItem={({ item, index }) => (
                    <View style={[
                        styles.cardWrapper,
                        index === 0 && styles.cardFirst,
                        index === CALLS.length - 1 && styles.cardLast,
                    ]}>
                        <CallCard call={item} />
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={() => (
                    <View>
                        {/* ── Quick action buttons ── */}
                        <View style={styles.actionsCard}>
                            {CALLSBTN.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => router.push(item.link as any)}
                                    activeOpacity={0.7}
                                    style={styles.actionBtn}
                                >
                                    <View style={[
                                        styles.actionCircle,
                                        { backgroundColor: item.color ? "#FFF0F0" : "#E8FAF0" }
                                    ]}>
                                        <Ionicons
                                            name={item.iconName}
                                            size={22}
                                            color={item.color ?? WA_GREEN}
                                        />
                                    </View>
                                    <Text style={styles.actionLabel}>{item.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* ── Section label ── */}
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionDot} />
                            <Text style={styles.sectionTitle}>RECENT</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="call-outline" size={56} color="#CBD5E1" />
                        <Text style={styles.emptyTitle}>No recent calls</Text>
                        <Text style={styles.emptySubtitle}>
                            Your call history will appear here
                        </Text>
                    </View>
                }
            />
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 100,
    },

    // ── Action buttons ───────────────────────────
    actionsCard: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#fff",
        // marginHorizontal: 12,
        marginTop: 14,
        borderRadius: 16,
        paddingVertical: 18,
        // paddingHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    actionBtn: {
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
    actionCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: TEXT_PRIMARY,
        textAlign: "center",
    },

    // ── Section header ───────────────────────────
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 8,
    },
    sectionDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: WA_GREEN,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: TEXT_SECONDARY,
        letterSpacing: 0.6,
    },

    // ── Call cards grouped ───────────────────────
    cardWrapper: {
        backgroundColor: "#fff",
        // marginHorizontal: 12,
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

    // ── Empty state ──────────────────────────────
    empty: {
        alignItems: "center",
        paddingTop: 60,
        gap: 10,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: TEXT_PRIMARY,
        marginTop: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: TEXT_SECONDARY,
        textAlign: "center",
    },
});

export default Calls;