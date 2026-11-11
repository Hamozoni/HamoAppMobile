import React from "react";
import { Slot, Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="login"
                options={{
                    headerShown: false,
                }} />
            <Stack.Screen
                name="verify"
                options={{
                    headerShown: false,
                }} />
        </Stack>
    );
}
