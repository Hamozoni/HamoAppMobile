import React, { useRef } from "react";
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
                ref={messagesFlatListRef}
                data={messages}
                inverted
                renderItem={({ item }) => <MessageCard message={item} />}
                keyExtractor={(item) =>
                    item.clientMessageId ?? item._id  // ✅ fixed — was item.id
                }
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, padding: 16 }}
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
