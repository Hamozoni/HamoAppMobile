import React, { useEffect, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import { FlatList, StyleSheet, View } from "react-native";
import { useMessages } from "../../../hooks/useMessage";
import { usePendingStore } from "../../../hooks/store/usePendingStore";

export default function ChatDetails() {
    const { phoneNumber } = useLocalSearchParams<{
        phoneNumber: string;
    }>();

    const { messages, sendMessage } = useMessages({ phoneNumber });

    const flatListRef = useRef<FlatList>(null);

    const { pendingLocation, clearPendingLocation } = usePendingStore();

    // ✅ Handle sending pending location
    useEffect(() => {
        if (!pendingLocation) return;

        sendMessage({
            location: {
                latitude: pendingLocation.latitude,
                longitude: pendingLocation.longitude,
                name: pendingLocation.name,
            },
        });

        clearPendingLocation();
    }, [pendingLocation]);

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

            <ChatFooter
                sendMessage={sendMessage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingVertical: 20,
    },
});