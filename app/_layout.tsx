import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { queryClient } from "../lib/queryClient.config";
import { QueryClientProvider } from "@tanstack/react-query";

import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import { useSocketConnection } from "../hooks/useSocketConnection";
// import { useGlobalSocketListeners } from "../hooks/useGlobalSocket";

export default function RootLayout() {

    // const AppListtener = () => {

    //     useSocketConnection()
    //     useGlobalSocketListeners();
    //     return null

    // };
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <KeyboardProvider>
                    <QueryClientProvider client={queryClient}>
                        {/* <AuthBootstrap /> */}
                        {/* <AppListtener /> */}
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" />
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="(screens)" />
                            <Stack.Screen name="(auth)" />
                        </Stack>
                    </QueryClientProvider>

                </KeyboardProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>

    );
}
