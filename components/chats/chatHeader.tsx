import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useContactsStore } from "../../hooks/store/useContactsStore";
import { useAuthStore } from "../../hooks/store/useAuthStore";
import Avatar from "../ui/avatar";
import { useChatsStore } from "../../hooks/store/useChatsStore";

interface ChatHeaderProps {
    phoneNumber: string;
}

export const ChatHeaderLeft = () => {

    const router = useRouter();
    return (
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#76787aff" />
        </TouchableOpacity>
    );
};

export const ChatHeaderMiddle = ({ phoneNumber }: ChatHeaderProps) => {
    const { registered } = useContactsStore();
    const user = useAuthStore(state => state.user);

    const chats = useChatsStore((state) => state.chats);

    // 1. Safely find the chat where one of the participants matches the phone number
    const contact = chats?.find((chat) =>
        chat?.participants?.some((participant) => participant?.phoneNumber === phoneNumber)
    )?.participants?.find(e => e.phoneNumber === phoneNumber)

    const findContact = () => {
        return registered?.find(e => e.phoneNumber === phoneNumber)
    };

    const router = useRouter()

    return (
        <TouchableOpacity onPress={() => router.push(`chats/profile/${phoneNumber}`)} style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
            <Avatar
                profilePicture={contact?.profilePicture?.secureUrl}
                displayName={findContact()?.displayName || contact?.phoneNumber} />
            <TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    {findContact()?.displayName || contact?.phoneNumber}
                    {user?.phoneNumber === contact?.phoneNumber && ' ( You )'}
                </Text>
                <Text style={{ fontSize: 14, color: "#666" }}>on line</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export const ChatHeaderRight = () => {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            <TouchableOpacity>
                <Ionicons name="videocam-outline" size={26} color="#76787aff" />
            </TouchableOpacity>
            <TouchableOpacity>
                <Ionicons name="call-outline" size={26} color="#76787aff" />
            </TouchableOpacity>
        </View>
    );
};
