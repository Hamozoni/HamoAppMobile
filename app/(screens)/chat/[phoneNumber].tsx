import React, { useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import { FlatList } from "react-native";
import { MESSAGES } from "../../../constants/messages";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import { ChatMessage } from "../../../components/cards/messageCard";

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
        <ThemedSafeAreaView>
            <FlatList
                data={messages}
                inverted
                renderItem={({ item }) => <MessageCard message={item} />}
                keyExtractor={(item) => item.id}
                style={{ paddingHorizontal: 5, paddingVertical: 20, flex: 1 }}
                showsVerticalScrollIndicator={false}
                ref={messagesFlatListRef}
            />
            <ChatFooter phoneNumber={phoneNumber} />
        </ThemedSafeAreaView>
    );
}
