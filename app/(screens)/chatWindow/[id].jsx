import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import { FlatList } from "react-native";
import { MESSAGES } from "../../../constants/messages";
import { useRef, useState } from "react";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";

export default function ChatDetails() {

    const { id } = useLocalSearchParams();
    const messagesFlatListRef = useRef(null);
    const [messages, setMessages] = useState(MESSAGES);

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
                onContentOffsetChange={handleScroll}
                renderItem={({ item }) => <MessageCard message={item} />}
                keyExtractor={(item) => item.id}
                style={{ paddingHorizontal: 5, paddingVertical: 20, flex: 1 }}
                showsVerticalScrollIndicator={false}
                ref={messagesFlatListRef}
            />

            <ChatFooter id={id} />
        </ThemedSafeAreaView>
    );
}