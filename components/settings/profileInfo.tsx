import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ThemedViewContainer from "../themedViews/ThemedViewContainer";
import TitleForwardIconBtn from "../buttons/titleForwardIconBtn";
import { useAuthStore } from "../../hooks/store/useAuthStore";

export const ProfileInfo = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    console.log(user);
    return (
        <ThemedViewContainer >
            <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#eee", paddingVertical: 20, paddingHorizontal: 10, gap: 10, }}>
                <TouchableOpacity onPress={() => router.push("/settings/profile" as any)}>
                    <Image
                        source={{
                            uri: user?.
                                profilePictureFileId?.secureUrl
                        }}
                        style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: "#d6f897ff" }}
                    />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{user?.displayName}</Text>
                        <Text style={{ fontSize: 16 }}>{user?.about}</Text>
                    </View>
                    <View>
                        <Ionicons name="qr-code-outline" size={28} color="#000" />
                    </View>
                </View>
            </View>
            <TitleForwardIconBtn
                iconName="person-outline"
                title="Avatar"
                link="/settings/avatar"
                isLast={true}
            />
        </ThemedViewContainer>
    );
};
