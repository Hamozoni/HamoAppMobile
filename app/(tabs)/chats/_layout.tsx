import React from "react";
import { Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { RoundedBtn } from "../../../components/buttons/roundedBtn";

export default function ChatLayout() {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Chats",
                    headerTransparent: true,
                    headerLargeTitle: true,
                    headerSearchBarOptions: {
                        placeholder: "Search",
                    },
                    headerRight: () => (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <RoundedBtn iconName="camera" color="#1078b9ff" size={26} onPress={() => {
                                router.push("/chats/camera" as any);
                            }} />
                            <RoundedBtn iconName="create-outline" color="#1078b9ff" size={26} onPress={() => {
                                router.push("/chats/contacts" as any);
                            }} />
                        </View>
                    ),
                }}
            />
            <Stack.Screen
                name="camera"
                options={{
                    headerTransparent: true,
                    presentation: "fullScreenModal",
                    animation: "flip",
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
        </Stack>
    );
}
