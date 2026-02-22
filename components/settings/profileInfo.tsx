import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ThemedViewContainer from "../themedViews/ThemedViewContainer";
import TitleForwardIconBtn from "../buttons/titleForwardIconBtn";
import { useAuthStore } from "../../hooks/store/useAuthStore";
import Avatar from "../ui/avatar";

export const ProfileInfo = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    console.log(user);
    return (
        <ThemedViewContainer >
            <TouchableOpacity onPress={() => router.push("/settings/profile" as any)} style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#eee", paddingVertical: 20, paddingHorizontal: 10, gap: 10, }}>

                <Avatar profilePicture={user?.profilePicture?.secureUrl} displayName={user?.displayName} />
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{user?.displayName}</Text>
                        <Text style={{ fontSize: 16 }}>{user?.about}</Text>
                    </View>
                    <View>
                        <Ionicons name="qr-code-outline" size={28} color="#000" />
                    </View>
                </View>
            </TouchableOpacity>
            <TitleForwardIconBtn
                iconName="person-outline"
                title="Avatar"
                link="/settings/avatar"
                isLast={true}
            />
        </ThemedViewContainer>
    );
};
