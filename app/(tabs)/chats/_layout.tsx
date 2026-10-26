import React from "react";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";

export default function ChatLayout() {
    const router = useRouter();

    return (
        <Stack >
            <Stack.Screen
                name="index"

                options={{
                    title: "Chats",
                    headerLargeTitle: true,
                    // headerShown: true,
                    headerTransparent: true,
                    // headerSearchBarOptions: {
                    //     placeholder: "Search",
                    // }
                }}
            />
        </Stack>
    );
}
