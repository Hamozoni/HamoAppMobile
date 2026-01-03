import { Stack } from "expo-router";


export default function StatusLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="[index]"
                options={{
                    headerShown: false,
                }} />
        </Stack>
    );
}