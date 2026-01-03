import { Image, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function VideoMessageBubble({ message }) {
    const router = useRouter();
    return (
        <TouchableOpacity onPress={() => router.push({ pathname: "/chatWindow/mediaGallery", params: { id: message?.metadata?._id } })}>
            <Image
                source={message?.metadata?.thumbnailUrl}
                style={{ width: 250, height: 250, borderRadius: 10, objectFit: "cover" }}
            />
            <View style={{ position: "absolute", top: 0, left: 0, width: 250, height: 250, justifyContent: "center", alignItems: "center" }}>
                <Ionicons name="play" size={54} color="white" />
            </View>
        </TouchableOpacity>
    );
};
