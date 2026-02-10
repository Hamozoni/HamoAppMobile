import React from "react";
import { Stack } from "expo-router";

export default function ScreenLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="calls"
                options={{
                    headerShown: false,
                }} />
            <Stack.Screen
                name="chat"
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
