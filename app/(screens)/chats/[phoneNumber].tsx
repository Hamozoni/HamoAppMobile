import React, { useEffect, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useMessages } from "../../../hooks/useMessage";
import { usePendingStore } from "../../../hooks/store/usePendingStore";
import { useGetmessages } from "../../../hooks/api/useGetMessagesApi";
import { useChatsStore } from "../../../hooks/store/useChatsStore";
import { useMessagesStore } from "../../../hooks/store/useMessageStore";
import { LocationAccuracy } from "expo-location";

export default function ChatDetails() {

    const { phoneNumber } = useLocalSearchParams<{
        phoneNumber: string;
    }>();

    const chats = useChatsStore((state) => state.chats);

    // 1. Safely find the chat where one of the participants matches the phone number
    const currentChatId: string | undefined = chats?.find((chat) =>
        chat?.participants?.some((participant) => participant?.phoneNumber === phoneNumber)
    )?._id;

    // 2. Pass currentChatId to your query hook
    const { isLoading, error } = useGetmessages(currentChatId);
    const messages = useMessagesStore(e => e.messages[currentChatId ?? 0])

    const flatListRef = useRef<FlatList>(null);

    const { pendingLocation, clearPendingLocation } = usePendingStore();

    // ✅ Handle sending pending location
    useEffect(() => {
        if (!pendingLocation) return;



        clearPendingLocation();
    }, [pendingLocation]);

    if (isLoading) {
        return <ActivityIndicator />
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <FlatList
                ref={flatListRef}
                data={messages}
                inverted   // ✅ WhatsApp behavior
                keyExtractor={(item) => item.clientMessageId ?? item._id}
                renderItem={({ item, index }) => (
                    <MessageCard
                        message={item}
                        // ✅ because list is inverted
                        prevMessage={messages[index + 1]}
                    />
                )}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, padding: 16 }}

                // ✅ keeps position stable when new messages arrive
                maintainVisibleContentPosition={{
                    minIndexForVisible: 1,
                }}
            />

            <ChatFooter />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingVertical: 20,
    },
});