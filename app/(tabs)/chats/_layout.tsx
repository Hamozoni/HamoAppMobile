import React from "react";
import { Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { RoundedBtn } from "../../../components/buttons/roundedBtn";

export default function ChatLayout() {
    const router = useRouter();

    return (
        <Stack >
            <Stack.Screen
                name="index"
                options={{
                    title: "Chats",
                    headerTransparent: true,
                    headerLargeTitle: true,
                    headerSearchBarOptions: {
                        placeholder: "Search",
                    }
                }}
            />
        </Stack>
    );
}
