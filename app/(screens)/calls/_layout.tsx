import React from "react";
import { Stack } from "expo-router";

export default function CallsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="call" />
        </Stack>
    );
}
