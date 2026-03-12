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
        <TouchableOpacity style={{ overflow: "hidden", borderRadius: 10, paddingBottom: 10, marginBottom: 5 }} >
            <Image
                source={message?.file?.metadata?.url as ImageSourcePropType}
                style={{ width: 220, height: 70 }}
            />
            <View style={{ paddingTop: 10, flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Ionicons name="document-text-outline" size={34} color="#f54848ff" />
                <View>
                    <Text style={{ fontSize: 18, fontWeight: "500" }}>{message?.file?.metadata?.name}</Text>
                    <Text style={{ fontSize: 12, fontWeight: "500" }}>{message?.file?.metadata?.size}MB {message?.file?.metadata?.mimeType?.split("/")[1]}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
