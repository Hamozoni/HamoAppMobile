import { Stack } from "expo-router";

export default function SettingLayout() {
    return (
        <Stack >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    title: "Settings",
                    headerLargeTitle: true,
                    headerSearchBarOptions: {
                        placeholder: "Search",

                    }
                }} />
            <Stack.Screen
                name="profile"
                options={{
                    headerShown: true,
                    title: "Profile",
                    headerBackButtonMenuEnabled: true,
                    headerBackButtonDisplayMode: "minimal",
                }}
            />
        </Stack>
    );
}