import { Stack } from "expo-router";

export default function ScreenLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="calls"
                options={{
                    headerShown: false,
                }} />
            <Stack.Screen
                name="chatWindow"
                options={{
                    headerShown: false,
                }} />
            <Stack.Screen
                name="status"
                options={{
                    headerShown: false,
                }} />
            <Stack.Screen
                name="setting"
                options={{
                    headerShown: false,
                }} />
        </Stack>
    );
}