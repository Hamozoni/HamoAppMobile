import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ThemedViewContainer from "../themedViews/ThemedViewContainer";
import TitleForwardIconBtn from "../buttons/titleForwardIconBtn";

export const ProfileInfo = () => {
    const router = useRouter();
    return (
        <ThemedViewContainer >
            <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#eee", paddingVertical: 20, paddingHorizontal: 10, gap: 10, }}>
                <TouchableOpacity onPress={() => router.push("/settings/profile" as any)}>
                    <Image
                        source={require("../../assets/images/pexels-al-amin-muhammad-988616478-29680723.jpg")}
                        style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: "#d6f897ff" }}
                    />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>John Doe</Text>
                        <Text style={{ fontSize: 16 }}>At work</Text>
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
