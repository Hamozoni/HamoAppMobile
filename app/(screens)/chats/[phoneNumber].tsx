import React, { useEffect, useMemo, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import { FlatList, StyleSheet, View } from "react-native";
import { useMessages } from "../../../hooks/useMessage";
import { usePendingStore } from "../../../hooks/store/usePendingStore";

export default function ChatDetails() {

    const { phoneNumber } = useLocalSearchParams<{
        phoneNumber: string;
    }>();

    const router = useRouter()

    const { messages, sendMessage } = useMessages({ phoneNumber });

    const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);
    const flatListRef = useRef<FlatList>(null);
    // ✅ Scroll to bottom when messages change;

    const handleScroll = () => {
        if (reversedMessages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false });
        }
    }
    useEffect(() => {
        handleScroll()
    }, [reversedMessages.length]);

    const { pendingLocation, clearPendingLocation } = usePendingStore();

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
                data={messages}
                renderItem={({ item, index }) => (
                    <MessageCard
                        message={item}
                        prevMessage={messages[index - 1]}  // ✅ use reversedMessages directly
                    />
                )}
                keyExtractor={(item) => item.clientMessageId ?? item._id}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                ref={flatListRef}
                style={{ flex: 1, padding: 16 }}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: false })
                }
                onLayout={() =>
                    flatListRef.current?.scrollToEnd({ animated: false })
                }
            />
            <ChatFooter
                onFocus={handleScroll}
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
