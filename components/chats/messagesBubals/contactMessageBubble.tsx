import React from "react";
import MessageStatusBubble from "./messageStatusBubble";
import { Image, Text, TouchableOpacity, View, ImageSourcePropType } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Message {
    metadata?: {
        photoURL: ImageSourcePropType;
        displayName: string;
        phoneNumber: string;
    };
    senderId?: number;
}

interface ContactMessageBubbleProps {
    message: Message;
}

export default function ContactMessageBubble({ message }: ContactMessageBubbleProps) {
    return (
        <View style={{ minWidth: 220 }}>
            <View style={{ paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#00000011' }}>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Image
                        source={message?.metadata?.photoURL as ImageSourcePropType}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: "600" }}>{message?.metadata?.displayName}</Text>
                        <Text style={{ fontSize: 14, fontWeight: "500" }}>{message?.metadata?.phoneNumber}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="black" />
                </TouchableOpacity>
                <MessageStatusBubble message={message as any} />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "space-between", paddingTop: 10 }}>
                <TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: "500", color: "#007AFF" }}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: "500", color: "#007AFF" }}>Add contact</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
