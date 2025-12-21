import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {

    return (
        <GestureHandlerRootView>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="chat" />
                <Stack.Screen name="status/index" />
            </Stack>
        </GestureHandlerRootView>
    );
}