import React from "react";
import { Image, TouchableOpacity, ImageSourcePropType } from "react-native";
import { useRouter } from "expo-router";
import { ILocalMessage } from "../../../types/message.types";


interface ImageMessageBubbleProps {
    message: ILocalMessage;
    isMine: boolean
}

export default function ImageMessageBubble({ message, isMine }: ImageMessageBubbleProps) {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => router.push({ pathname: "/chatWindow/mediaGallery" as any, params: { id: message?.file?.metadata?._id } })} >
            <Image
                source={{ uri: message?.file?.secureUrl }}
                style={{ width: 250, height: 250, borderRadius: 10 }}
            />
        </TouchableOpacity>
    );
}
