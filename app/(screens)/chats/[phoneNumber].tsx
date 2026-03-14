import React, { useEffect, useMemo, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import { FlatList, StyleSheet, View } from "react-native";
import { useMessages } from "../../../hooks/useMessage";

export default function ChatDetails() {

    const { phoneNumber, pendingLocation } = useLocalSearchParams<{
        phoneNumber: string;
        pendingLocation: string;
    }>();

    const router = useRouter()

    const { messages, sendMessage } = useMessages({ phoneNumber });

    const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);
    const flatListRef = useRef<FlatList>(null);
    // ✅ Scroll to bottom when messages change
    useEffect(() => {
        if (reversedMessages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false });
        }
    }, [reversedMessages.length]);

    useEffect(() => {
        if (!pendingLocation) return;
        try {
            const location = JSON.parse(pendingLocation);
            sendMessage({ location });
            router.setParams({ pendingLocation: "" }); // ✅ clear after sending
        } catch (e) {
            console.error("Failed to parse location:", e);
        }
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
                phoneNumber={phoneNumber}
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
