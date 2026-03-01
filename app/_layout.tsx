import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { queryClient } from "../lib/queryClient.config";
import { QueryClientProvider } from "@tanstack/react-query";

import { AuthBootstrap } from "../utils/authBootstrap";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { ActivityIndicator, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSocketConnection } from "../hooks/useSocketConnection";

export default function RootLayout() {

    const { user, hydrated } = useAuthStore();

    useSocketConnection();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <QueryClientProvider client={queryClient}>
                    <AuthBootstrap />
                    {!hydrated ? <ActivityIndicator /> :
                        <Stack screenOptions={{ headerShown: false }}>
                            {
                                user ? <>
                                    <Stack.Screen name="(tabs)" />
                                    <Stack.Screen name="(screens)" />
                                </> :
                                    <Stack.Screen name="(auth)" />
                            }
                        </Stack>
                    }
                </QueryClientProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>

    );
}
