import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { queryClient } from "../lib/queryClient.config";
import { QueryClientProvider } from "@tanstack/react-query";

import { AuthBootstrap } from "../utils/authBootstrap";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { ActivityIndicator, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {

    const { user, hydrated } = useAuthStore();

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
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
            </GestureHandlerRootView>

        </SafeAreaProvider>
    );
}
