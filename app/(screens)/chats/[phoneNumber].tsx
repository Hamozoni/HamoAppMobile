import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import { useGetmessages } from "../../../hooks/api/useGetMessagesApi";
import { useChatsStore } from "../../../hooks/store/useChatsStore";
import { useMessagesStore } from "../../../hooks/store/useMessageStore";
import { SOCKET_EVENTS, socketService } from "../../../services/socket.service";

export default function ChatDetails() {
    const { chatId } = useLocalSearchParams<{ chatId: string; contactId: string }>();
    const { setCurrentChat } = useChatsStore();

    const { isLoading, error } = useGetmessages(chatId ?? false);
    const messages = useMessagesStore((s) => s.messages[chatId]) ?? [];
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (!chatId) return;
        socketService.emit(SOCKET_EVENTS.JOIN_CHAT, chatId);
        return () => {
            socketService.emit(SOCKET_EVENTS.LEAVE_CHAT, chatId);
            socketService.off(SOCKET_EVENTS.JOIN_CHAT);
            setCurrentChat(null)
        }

    }, [chatId]);




    if (isLoading && messages.length === 0) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    };


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
                    inverted={true}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => (
                        <MessageCard message={item} prevMessage={messages[index + 1]} />
                    )}
                    style={styles.flex}
                    contentContainerStyle={styles.listContent}
                    contentInsetAdjustmentBehavior="automatic"
                    keyboardDismissMode="on-drag"        // instead of "interactive"
                    removeClippedSubviews={false}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                />
                <ChatFooter />
            </KeyboardAvoidingView>

        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    listContent: { padding: 20 },
});