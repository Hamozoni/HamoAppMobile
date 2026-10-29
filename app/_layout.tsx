import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { queryClient } from "../lib/queryClient.config";
import { QueryClientProvider } from "@tanstack/react-query";

import { KeyboardProvider } from "react-native-keyboard-controller";
import { useSocketListeners } from "../hooks/useSocket";


export default function RootLayout() {


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
                <QueryClientProvider client={queryClient}>
                    {/* <AppListtener /> */}
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="(screens)" />
                        <Stack.Screen name="(auth)" />
                    </Stack>
                </QueryClientProvider>
            </KeyboardProvider>
        </GestureHandlerRootView>

    );
}
