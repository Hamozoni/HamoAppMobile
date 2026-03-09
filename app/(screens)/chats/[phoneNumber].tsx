import React, { useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import { FlatList, StyleSheet } from "react-native";;
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useMessages } from "../../../hooks/useMessage";

export default function ChatDetails() {

    const { chatId, phoneNumber, receiverId } = useLocalSearchParams<{
        chatId: string;
        phoneNumber: string;
        receiverId: string;
    }>();
    const messagesFlatListRef = useRef<FlatList>(null);


    const { messages, sendMessage } = useMessages({
        chatId,
        receiverId,
    });

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
                <ChatFooter
                    phoneNumber={phoneNumber}
                    sendMessage={sendMessage}
                />

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
