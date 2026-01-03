import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import { FlatList } from "react-native";
import { MESSAGES } from "../../../constants/messages";
import { useRef, useState } from "react";

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
        <SafeAreaView
            edges={["bottom"]}
            style={{
                flex: 1,
                backgroundColor: "#fff",
            }}
        >

            <FlatList
                data={messages}
                inverted
                onContentOffsetChange={handleScroll}
                renderItem={({ item }) => <MessageCard message={item} />}
                keyExtractor={(item) => item.id}
                style={{ paddingHorizontal: 10, paddingVertical: 20, flex: 1 }}
                showsVerticalScrollIndicator={false}
                ref={messagesFlatListRef}
            />

            <ChatFooter id={id} />



        </SafeAreaView>
    );
}