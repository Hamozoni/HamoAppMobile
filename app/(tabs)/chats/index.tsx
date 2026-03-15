import React, { useState, useMemo } from "react";
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, Dimensions, FlatList,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ChatCard } from "../../../components/cards/chatCard";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import { useChats } from "../../../hooks/api/useChatsApi";
import { useContactsStore } from "../../../hooks/store/useContactsStore";

const { width } = Dimensions.get("window");
const WA_GREEN = "#25D366";
const WA_DARK = "#075E54";
const TEXT_PRIMARY = "#111B21";
const TEXT_SECONDARY = "#667781";

const FILTERS = ["All", "Unread", "Favorites", "Groups"];

const Chats = () => {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState("All");
    const [isEdit, setIsEdit] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const { chats, loading, fetchChats } = useChats();
    const registered = useContactsStore(state => state.registered);

    const handleEdit = () => {
        setIsEdit(prev => !prev);
        setSelectedIds(new Set());
    };

    const handleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const filteredChats = useMemo(() => {
        if (activeFilter === "Unread") return chats.filter(c => c.unreadCount > 0);
        if (activeFilter === "Groups") return chats.filter(c => c.isGroup);
        return chats;
    }, [activeFilter, chats]);

    return (
        <ThemedSafeAreaView>
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleEdit}>
                            <Text style={styles.headerBtn}>
                                {isEdit ? "Done" : "Edit"}
                            </Text>
                        </TouchableOpacity>
                    ),
                    headerRight: () => !isEdit ? (
                        <TouchableOpacity
                            style={{ paddingHorizontal: 5 }}
                            onPress={() => router.push("/chats/contacts" as any)}
                        >
                            <Ionicons name="create-outline" size={24} color={WA_DARK} />
                        </TouchableOpacity>
                    ) : null,
                }}
            />

            <FlatList
                data={filteredChats}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                refreshing={loading}
                onRefresh={fetchChats}

                ListHeaderComponent={() => (
                    <>
                        {/* ── Filter pills ── */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.filtersRow}
                        >
                            {FILTERS.map(filter => {
                                const isActive = activeFilter === filter;
                                return (
                                    <TouchableOpacity
                                        key={filter}
                                        onPress={() => !isEdit && setActiveFilter(filter)}
                                        activeOpacity={0.7}
                                        style={[
                                            styles.filterPill,
                                            isActive && styles.filterPillActive,
                                        ]}
                                    >
                                        <Text style={[
                                            styles.filterText,
                                            isActive && styles.filterTextActive,
                                        ]}>
                                            {filter}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        {/* ── Section label ── */}
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionDot} />
                            <Text style={styles.sectionTitle}>
                                {filteredChats.length} CONVERSATION{filteredChats.length !== 1 ? "S" : ""}
                            </Text>
                        </View>
                    </>
                )}

                renderItem={({ item, index }) => (
                    <View style={[
                        styles.cardWrapper,
                        index === 0 && styles.cardFirst,
                        index === filteredChats.length - 1 && styles.cardLast,
                    ]}>
                        <ChatCard
                            chat={item as any}
                            isSelected={selectedIds.has(item._id)}
                            contact={registered.find(e => e?._id === item.contact?._id)}
                            isEditMode={isEdit}
                            onSelect={() => handleSelect(item._id)}
                        />
                    </View>
                )}

                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.empty}>
                            <Ionicons name="chatbubbles-outline" size={64} color="#CBD5E1" />
                            <Text style={styles.emptyTitle}>No chats yet</Text>
                            <Text style={styles.emptySubtitle}>
                                Start a conversation by tapping the compose icon
                            </Text>
                        </View>
                    ) : null
                }
            />

            {/* ── Edit action bar ── */}
            {isEdit && (
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(150)}
                    style={styles.editBar}
                >
                    <TouchableOpacity style={styles.editAction}>
                        <Ionicons name="archive-outline" size={20} color={TEXT_SECONDARY} />
                        <Text style={styles.editActionText}>Archive</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editAction}>
                        <Ionicons name="checkmark-done-outline" size={20} color={WA_GREEN} />
                        <Text style={[styles.editActionText, { color: WA_GREEN }]}>Read all</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.editAction}
                        disabled={selectedIds.size === 0}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={20}
                            color={selectedIds.size > 0 ? "#FF3B30" : "#C8C8C8"}
                        />
                        <Text style={[
                            styles.editActionText,
                            { color: selectedIds.size > 0 ? "#FF3B30" : "#C8C8C8" },
                        ]}>
                            Delete {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 100,
    },
    headerBtn: {
        fontSize: 18,
        color: WA_DARK,
        fontWeight: "600",
        paddingHorizontal: 5,
    },
    filtersRow: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 8,
    },
    filterPill: {
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#E5E7EB",
    },
    filterPillActive: {
        backgroundColor: WA_DARK,
        borderColor: WA_DARK,
    },
    filterText: {
        fontSize: 14,
        fontWeight: "600",
        color: TEXT_SECONDARY,
    },
    filterTextActive: {
        color: "#fff",
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 20,
        paddingBottom: 8,
        marginBottom: 15,
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
        letterSpacing: 0.5,
    },
    cardWrapper: {
        backgroundColor: "#fff",
        marginHorizontal: 10,
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
    empty: {
        alignItems: "center",
        paddingTop: 80,
        paddingHorizontal: 40,
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
        lineHeight: 20,
    },
    editBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width,
        height: 72,
        backgroundColor: "#ffffffee",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#E5E7EB",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    editAction: {
        alignItems: "center",
        gap: 4,
    },
    editActionText: {
        fontSize: 12,
        fontWeight: "600",
        color: TEXT_SECONDARY,
    },
});

export default Chats;