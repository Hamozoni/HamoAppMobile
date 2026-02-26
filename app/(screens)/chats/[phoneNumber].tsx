import React, { useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import { FlatList, StyleSheet, View } from "react-native";
import { MESSAGES } from "../../../constants/messages";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import { ChatMessage } from "../../../components/cards/messageCard";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ChatDetails() {

    const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
    const messagesFlatListRef = useRef<FlatList>(null);
    const [messages] = useState<ChatMessage[]>(MESSAGES);

    const handleScroll = () => {
        if (messagesFlatListRef.current) {
            messagesFlatListRef.current.scrollToOffset({
                animated: true,
                offset: 0
            });
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} >
                <FlatList
                    data={messages}
                    inverted
                    renderItem={({ item }) => <MessageCard message={item} />}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    ref={messagesFlatListRef}
                    style={{ padding: 16 }}
                />
                <ChatFooter phoneNumber={phoneNumber} />

            </SafeAreaView>

        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingVertical: 20,
    }
})
