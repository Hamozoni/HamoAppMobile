import React from "react";
import { Image, TouchableOpacity, ImageSourcePropType } from "react-native";
import { useRouter } from "expo-router";

interface Message {
    metadata?: {
        _id: string | number;
        url: ImageSourcePropType;
    };
}

interface ImageMessageBubbleProps {
    message: Message;
}

export default function ImageMessageBubble({ message }: ImageMessageBubbleProps) {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => router.push({ pathname: "/chatWindow/mediaGallery" as any, params: { id: message?.metadata?._id } })} >
            <Image
                source={message?.metadata?.url as ImageSourcePropType}
                style={{ width: 250, height: 250, borderRadius: 10 }}
            />
        </TouchableOpacity>
    );
}
