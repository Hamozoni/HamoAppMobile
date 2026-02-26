import React from "react";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";

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
                    // headerSearchBarOptions: {
                    //     placeholder: "Search",
                    // }
                }}
            />
        </Stack>
    );
}
