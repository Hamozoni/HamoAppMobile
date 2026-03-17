import React from "react";
import { Image, Text, View, TouchableOpacity, ImageSourcePropType } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ILocalMessage } from "../../../types/message.types";


interface DocumentMessageBubbleProps {
    message: ILocalMessage;
    isMine: boolean
}

export default function DocumentMessageBubble({ message, isMine }: DocumentMessageBubbleProps) {
    return (
        <TouchableOpacity style={{ overflow: "hidden", borderRadius: 10, paddingBottom: 3 }} >
            <Image
                source={{ uri: message?.file?.secureUrl }}
                style={{ width: 220, height: 70 }}
            />
            <View style={{ paddingTop: 10, flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Ionicons name="document-text-outline" size={24} color="#ddd6d6ff" />
                <View>
                    <Text style={{ fontSize: 18, fontWeight: "500" }}>{message?.file?.metadata?.n}</Text>
                    <Text style={{ fontSize: 12, fontWeight: "500" }}>{Math.floor(message?.file?.metadata?.size / 1000)} MB</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
