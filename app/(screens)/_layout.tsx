import React from "react";
import { Stack } from "expo-router";
import { useGlobalSocketListeners } from "../../hooks/useGlobalSocket";

export default function ScreenLayout() {

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="calls"
                options={{
                    headerShown: false,
                }} />
            <Stack.Screen
                name="chats"
                options={{
                    headerShown: false,
                }} />
            <Stack.Screen
                name="status"
                options={{
                    headerShown: false,
                }} />
            <Stack.Screen
                name="settings"
                options={{
                    headerShown: false,
                }} />
        </Stack>
    );
}
