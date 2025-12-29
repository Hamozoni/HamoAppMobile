import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import { FlatList } from "react-native";
import { MESSAGES } from "../../../constants/messages";

export default function ChatDetails() {

    const { id } = useLocalSearchParams();

    return (
        <SafeAreaView
            edges={["bottom"]}
            style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#fff"
            }}
        >

            <FlatList
                data={MESSAGES}
                renderItem={({ item }) => <MessageCard message={item} />}
                keyExtractor={(item) => item.id}
                style={{ paddingHorizontal: 10, paddingVertical: 20, flex: 1 }}
                showsVerticalScrollIndicator={false}
            />

            <ChatFooter id={id} />

        </SafeAreaView>
    );
}