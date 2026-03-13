import React, { useMemo, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import { FlatList, StyleSheet, View } from "react-native";
import { useMessages } from "../../../hooks/useMessage";

export default function ChatDetails() {
    const messagesFlatListRef = useRef<FlatList>(null);
    const { phoneNumber } = useLocalSearchParams<{
        phoneNumber: string;
    }>();

    const { messages, sendMessage } = useMessages({ phoneNumber });
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
                ref={messagesFlatListRef}
                style={{ flex: 1, padding: 16 }}
                onContentSizeChange={() =>
                    messagesFlatListRef.current?.scrollToEnd({ animated: false })
                }
                onLayout={() =>
                    messagesFlatListRef.current?.scrollToEnd({ animated: false })
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
