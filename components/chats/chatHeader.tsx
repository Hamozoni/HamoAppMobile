import { Image, Text, TouchableOpacity, View } from "react-native";
import { CHATS } from "../../constants/chats";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";

interface ChatHeaderProps {
    id: string;
}

export const ChatHeaderLeft = ({ id }: ChatHeaderProps) => {
    const router = useRouter();
    return (
        <TouchableOpacity onPress={() => router.replace("/")}>
            <Ionicons name="chevron-back" size={24} color="#1fa105" />
        </TouchableOpacity>
    );
};

export const ChatHeaderMiddle = ({ id }: ChatHeaderProps) => {
    const chatIndex = Number.parseInt(id) - 1;
    const chat = CHATS[chatIndex];

    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
            <Image
                source={chat?.contact?.photoURL}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#ccc" }}
            />
            <TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>{chat?.contact?.displayName}</Text>
                <Text style={{ fontSize: 14, color: "#666" }}>on line</Text>
            </TouchableOpacity>
        </View>
    );
};

export const ChatHeaderRight = ({ id }: ChatHeaderProps) => {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            <TouchableOpacity>
                <Ionicons name="videocam-outline" size={24} color="#1fa105" />
            </TouchableOpacity>
            <TouchableOpacity>
                <Ionicons name="call-outline" size={24} color="#1fa105" />
            </TouchableOpacity>
        </View>
    );
};
