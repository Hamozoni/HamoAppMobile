import React from "react";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { ChatHeaderLeft, ChatHeaderRight, ChatHeaderMiddle } from "../../../components/chats/chatHeader";

export default function ChatWindowLayout() {

    const router = useRouter();

    return (
        <Stack >
            <Stack.Screen
                name="[phoneNumber]"
                options={
                    ({ route }) => {
                        const { phoneNumber } = route.params as { phoneNumber: string };
                        return {
                            headerShown: true,
                            headerLeft: () => <ChatHeaderLeft phoneNumber={phoneNumber} />,
                            headerRight: () => <ChatHeaderRight phoneNumber={phoneNumber} />,
                            headerTitle: () => <ChatHeaderMiddle phoneNumber={phoneNumber} />,
                        }
                    }
                }
            />
            <Stack.Screen
                name="mediaGallery"
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
            <Stack.Screen
                name="profile"
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
            <Stack.Screen
                name="shareContacts"
                options={{
                    title: "Share Contacts",
                    headerShown: true,
                    presentation: "modal",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>Cancel</Text>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>Next</Text>
                        </TouchableOpacity>
                    ),
                    headerSearchBarOptions: {
                        placeholder: "Search",
                    },
                }}
            />
            <Stack.Screen
                name="location"
                options={{
                    title: "Send Location",
                    headerShown: false,
                    presentation: "modal",
                }}
            />
        </Stack>
    );
}
