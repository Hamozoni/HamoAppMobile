import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { ILocalMessage } from "../../../types/message.types";


interface LocationMessageBubbleProps {
    message: ILocalMessage;
    isMine: boolean
}

export default function LocationMessageBubble({ message, isMine }: LocationMessageBubbleProps) {
    const locationUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${message?.location?.latitude},${message?.location?.longitude}&zoom=16&size=600x300&maptype=roadmap&markers=color:red|${message?.location?.latitude},${message?.location?.longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;

    return (
        <TouchableOpacity>
            <Image
                source={{ uri: locationUrl }}
                style={{ width: 250, height: 250, borderRadius: 10 }}
            />
        </TouchableOpacity>
    );
}
