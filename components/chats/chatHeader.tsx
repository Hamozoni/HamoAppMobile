import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useContactsStore } from "../../hooks/store/useContactsStore";
import { useAuthStore } from "../../hooks/store/useAuthStore";

interface ChatHeaderProps {
    phoneNumber: string;
}

export const ChatHeaderLeft = ({ phoneNumber }: ChatHeaderProps) => {

    const router = useRouter();
    return (
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#1fa105" />
        </TouchableOpacity>
    );
};

export const ChatHeaderMiddle = ({ phoneNumber }: ChatHeaderProps) => {

    const { registered } = useContactsStore();
    const user = useAuthStore(state => state.user)
    const findContact = () => {
        return registered?.find(e => e.phoneNumber === phoneNumber)
    };

    const router = useRouter()

    return (
        <TouchableOpacity onPress={() => router.push(`chats/profile/${phoneNumber}`)} style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
            <Image
                source={{ uri: findContact()?.profilePicture }}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#ccc" }}
            />
            <TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    {findContact()?.displayName} {user?.phoneNumber === findContact()?.phoneNumber && ' ( You )'}
                </Text>
                <Text style={{ fontSize: 14, color: "#666" }}>on line</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export const ChatHeaderRight = ({ phoneNumber }: ChatHeaderProps) => {
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
