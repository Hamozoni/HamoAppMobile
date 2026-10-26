import React, { useEffect, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import { usePendingStore } from "../../../hooks/store/usePendingStore";
import { useGetmessages } from "../../../hooks/api/useGetMessagesApi";
import { useChatsStore } from "../../../hooks/store/useChatsStore";
import { useMessagesStore } from "../../../hooks/store/useMessageStore";
import { useHeaderHeight } from "expo-router/build/react-navigation/index.js";

export default function ChatDetails() {
    const { contactId } = useLocalSearchParams<{ contactId: string }>();

    const chats = useChatsStore((s) => s.chats);
    const currentChatId = chats?.find((chat) =>
        chat?.participants?.some((p) => p?._id === contactId)
    )?._id;

    const { isLoading } = useGetmessages(currentChatId);
    const messages = useMessagesStore((s) => s.messages[currentChatId || contactId])?.reverse() ?? [];
    const flatListRef = useRef<FlatList>(null);

    const { pendingLocation, clearPendingLocation } = usePendingStore();

    // useEffect(() => {
    //     if (!pendingLocation) return;
    //     clearPendingLocation();
    // }, [pendingLocation]);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    };

    const headerHeight = useHeaderHeight();
    const overlapsHeader = Platform.OS === "ios";

    return (
        <ThemedSafeAreaView edges={[]}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior="padding"
                keyboardVerticalOffset={100}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    inverted
                    keyExtractor={(item) => item.clientMessageId ?? item._id}
                    renderItem={({ item, index }) => (
                        <MessageCard message={item} prevMessage={messages[index + 1]} />
                    )}
                    style={styles.flex}
                    contentContainerStyle={styles.listContent}
                    contentInsetAdjustmentBehavior="automatic"
                    keyboardShouldPersistTaps="handled"
                // keyboardDismissMode="interactive"
                // showsVerticalScrollIndicator={false}
                />
                <ChatFooter currentChatId={currentChatId || contactId} />
            </KeyboardAvoidingView>

        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    listContent: { padding: 20 },
});