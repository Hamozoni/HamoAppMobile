import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { queryClient } from "../lib/queryClient.config";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { AuthBootstrap } from "../utils/authBootstrap";
import { onAuthFailed } from "../utils/authEvents";
import * as SecureStore from "expo-secure-store";


export default function RootLayout() {

    const { hydrate } = useAuthStore();

    useEffect(() => {
        hydrate();
    }, []);

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
