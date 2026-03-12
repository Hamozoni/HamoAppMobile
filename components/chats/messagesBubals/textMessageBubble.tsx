import React from "react";
import { Text, View } from "react-native";
import { ILocalMessage } from "../../../types/message.types";


interface TextMessageBubbleProps {
    message: ILocalMessage;
    isMine: boolean
}

export default function TextMessageBubble({ message, isMine }: TextMessageBubbleProps) {
    return (
        <View >
            <Text style={{ color: message?.senderId ? "white" : "black", fontSize: 18, marginBottom: 10 }}>{message?.text}</Text>
        </View>
    );
}
