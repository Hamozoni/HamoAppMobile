import { Redirect, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { queryClient } from "../lib/queryClient.config";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { ActivityIndicator } from "react-native";
import { AuthBootstrap } from "../utils/authBootstrap";


export default function RootLayout() {

    const { hydrate, hydrated, user } = useAuthStore();

    useEffect(() => {
        hydrate();
    }, []);

    if (!hydrated) return <ActivityIndicator />;

    return (
        <>
            <AuthBootstrap />

            {!user ? <Redirect href="/(auth)/login" /> :
                <GestureHandlerRootView>
                    <QueryClientProvider client={queryClient}>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(screens)" />
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="(auth)" />
                        </Stack>
                    </QueryClientProvider>
                </GestureHandlerRootView>}
        </>
    );
}
