import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { queryClient } from "../lib/queryClient.config";
import { QueryClientProvider } from "@tanstack/react-query";

import { AuthBootstrap } from "../utils/authBootstrap";

export default function RootLayout() {
    return (
        <GestureHandlerRootView>
            <QueryClientProvider client={queryClient}>
                <AuthBootstrap />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(screens)" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" />
                </Stack>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
