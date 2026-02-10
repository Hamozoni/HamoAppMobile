import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Chat } from "../../types/components.types";

interface ChatCardProps {
    chat: Chat;
}

export const ChatCard = ({ chat }: ChatCardProps) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => router.push(`/chat/${chat?.id}` as any)}
            style={{ flexDirection: "row", flex: 1, alignItems: "center", gap: 5 }}>

            <Image
                source={require("../../assets/images/pexels-al-amin-muhammad-988616478-29680723.jpg")}
                onError={() => console.log("Image not found")}
                style={{ width: 55, height: 55, borderRadius: 50, borderColor: "#eee", borderWidth: 1, backgroundColor: "#eff" }}

            />

            <View style={{ flex: 1, borderBottomColor: "#eee", borderBottomWidth: 1, paddingVertical: 15 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>{chat?.contact?.displayName}</Text>
                    <Text style={{ fontSize: 12, color: "#817d7dff", fontWeight: "bold" }}>{chat?.lastMessage?.createdAt}</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 14, color: "#5e5e5eff" }}>{chat?.lastMessage?.text}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
