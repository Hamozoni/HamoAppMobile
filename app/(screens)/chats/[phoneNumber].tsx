import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import { usePendingStore } from "../../../hooks/store/usePendingStore";
import { useGetmessages } from "../../../hooks/api/useGetMessagesApi";
import { useChatsStore } from "../../../hooks/store/useChatsStore";
import { useMessagesStore } from "../../../hooks/store/useMessageStore";
import { SOCKET_EVENTS, socketService } from "../../../services/socket.service";
import { Socket } from "socket.io-client";
import { useAuthStore } from "../../../hooks/store/useAuthStore";

export default function ChatDetails() {
    const { contactId } = useLocalSearchParams<{ contactId: string }>();

    const { chats, updateLastMessage } = useChatsStore();
    const { addMessage, updateMessageStatus } = useMessagesStore();
    const chatIdRef = useRef<string | undefined>(undefined);
    const found = chats?.find((c) => c?.participants?.some((p) => p?._id === contactId))?._id;
    if (found) chatIdRef.current = found;
    const currentChatId = found ?? chatIdRef.current;

    const { isLoading } = useGetmessages(currentChatId);
    const messages = useMessagesStore((s) => s.messages[currentChatId || contactId]) ?? [];
    const flatListRef = useRef<FlatList>(null);

    const { pendingLocation, clearPendingLocation } = usePendingStore();

    const { user } = useAuthStore()
    useEffect(() => {
        if (!pendingLocation) return;
        clearPendingLocation();
    }, [pendingLocation]);
    const socket = socketService.socket;

    useEffect(() => {
        if (!socket || !currentChatId) return;

        socket.on(SOCKET_EVENTS.MESSAGE_NEW, ({ message }) => {
            console.log({ message })
            addMessage(message.chatId, message);
            updateLastMessage(message.chatId, {
                lastMessageAt: message.createdAt,
                lastMessageId: message._id,
                lastMessageSenderId: message.senderId,
                lastMessageStatus: message.status,
                lastMessageText: message.text,
                lastMessageType: message.type,
            });

            socket.emit(SOCKET_EVENTS.MESSAGE_READ, { chatId: currentChatId, messageId: message._id })
        });

        socket.on(SOCKET_EVENTS.MESSAGE_READ, ({ chatId, messageId }) => {
            updateMessageStatus(chatId, messageId, "read")
        });

        socket.emit(SOCKET_EVENTS.JOIN_CHAT, { chatId: currentChatId });
        return () => {
            socketService.off(SOCKET_EVENTS.JOIN_CHAT);
            socketService.off(SOCKET_EVENTS.MESSAGE_READ);
            socketService.off(SOCKET_EVENTS.MESSAGE_NEW);
            socketService.emit(SOCKET_EVENTS.LEAVE_CHAT, { chatId: currentChatId });
        }
    }, [contactId]);

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
                    keyExtractor={(item) => item.clientMessageId ?? item._id}
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