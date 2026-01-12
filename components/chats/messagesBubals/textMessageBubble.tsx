import React from "react";
import { Text, View } from "react-native";

interface Message {
    senderId: number;
    text?: string;
}

interface TextMessageBubbleProps {
    message: Message;
}

export default function TextMessageBubble({ message }: TextMessageBubbleProps) {
    return (
        <View >
            <Text style={{ color: message?.senderId === 1 ? "white" : "black", fontSize: 18, marginBottom: 10 }}>{message?.text}</Text>
        </View>
    );
}
