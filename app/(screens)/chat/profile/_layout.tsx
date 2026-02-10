import { Stack } from "expo-router";



export default function ChatProfileLayout() {
    return (
        <Stack >
            <Stack.Screen name="[phoneNumber]" options={{ headerShown: true }} />
        </Stack>
    )
}