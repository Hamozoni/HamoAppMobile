import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export const ChatCard = ({ chat }) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => router.push(`/chatWindow/${chat?.id}`)}
            style={{ flexDirection: "row", flex: 1, alignItems: "center", gap: 5 }}>

            <Image
                source={require("../../assets/images/pexels-al-amin-muhammad-988616478-29680723.jpg")}
                onError={() => console.log("Image not found")}
                style={{ width: 60, height: 60, borderRadius: 50, borderColor: "#eee", borderWidth: 1, backgroundColor: "#eff" }}

            />

            <View style={{ flex: 1, borderBottomColor: "#eee", borderBottomWidth: 1, height: "100%" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{chat?.contact?.displayName}</Text>
                    <Text style={{ fontSize: 12, color: "#817d7dff", fontWeight: "bold" }}>{chat?.lastMessage?.createdAt}</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 14, color: "#5e5e5eff" }}>{chat?.lastMessage?.text}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};