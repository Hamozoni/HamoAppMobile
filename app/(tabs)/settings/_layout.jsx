import { Stack } from "expo-router";
import { RoundedBtn } from "../../../components/ui/roundedBtn";
import { useRouter } from "expo-router";

export default function SettingLayout() {
    const router = useRouter();
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
            <Stack.Screen
                name="linked"
                options={{
                    headerShown: true,
                    title: "Linked Devices",
                    headerLeft: () => (
                        <RoundedBtn iconName="chevron-back" onPress={() => router.back()} />
                    )
                }}
            />
            <Stack.Screen
                name="Account"
                options={{
                    headerShown: true,
                    title: "Account",
                    headerLeft: () => (
                        <RoundedBtn iconName="chevron-back" onPress={() => router.back()} />
                    )
                }}
            />
            <Stack.Screen
                name="privacy"
                options={{
                    headerShown: false,
                    title: "Privacy"
                }}
            />
            <Stack.Screen
                name="chats"
                options={{
                    headerShown: false,
                    title: "Chats"
                }}
            />
            <Stack.Screen
                name="notifications"
                options={{
                    headerShown: true,
                    title: "Notifications",
                    headerLeft: () => (
                        <RoundedBtn iconName="chevron-back" onPress={() => router.back()} />
                    )
                }}
            />
        </Stack>
    );
}