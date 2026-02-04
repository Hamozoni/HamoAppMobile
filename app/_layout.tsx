import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { queryClient } from "../lib/queryClient.config";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { AuthBootstrap } from "../utils/authBootstrap";
import { onAuthFailed } from "../utils/authEvents";
import * as SecureStore from "expo-secure-store";
import { runMigrations } from "../db/runMigration";
import { ActivityIndicator, View } from "react-native";


export default function RootLayout() {

    const { hydrate } = useAuthStore();
    const [isReady, setIsready] = useState<boolean>(false)

    useEffect(() => {
        hydrate();
        runMigrations();
        setIsready(true)
    }, []);

    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    useEffect(() => {
        onAuthFailed(async () => {
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
            await useAuthStore.getState().clearUser();
        });
    }, []);


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
