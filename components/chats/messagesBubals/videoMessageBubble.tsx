import React from "react";
import { Image, TouchableOpacity, View, ImageSourcePropType } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

interface Message {
    metadata?: {
        _id: string | number;
        thumbnailUrl: ImageSourcePropType;
    };
}

interface VideoMessageBubbleProps {
    message: Message;
}

export default function VideoMessageBubble({ message }: VideoMessageBubbleProps) {
    const router = useRouter();
    return (
        <TouchableOpacity onPress={() => router.push({ pathname: "/chatWindow/mediaGallery" as any, params: { id: message?.metadata?._id } })}>
            <Image
                source={message?.metadata?.thumbnailUrl as ImageSourcePropType}
                style={{ width: 250, height: 250, borderRadius: 10 }}
            />
            <View style={{ position: "absolute", top: 0, left: 0, width: 250, height: 250, justifyContent: "center", alignItems: "center" }}>
                <Ionicons name="play" size={54} color="white" />
            </View>
        </TouchableOpacity>
    );
}
