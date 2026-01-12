import React from "react";
import { Stack } from "expo-router";

export default function UpdatesLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    title: "Contacts",
                    headerTransparent: true,
                }} />
        </Stack>
    );
}
