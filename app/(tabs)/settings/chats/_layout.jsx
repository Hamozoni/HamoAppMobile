import { Stack } from "expo-router";
import { RoundedBtn } from "../../../../components/ui/roundedBtn";


export default function SettingsChatsLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    title: "Chats",
                    headerLeft: () => (
                        <RoundedBtn iconName="chevron-back" onPress={() => router.back()} />
                    )
                }}
            />
        </Stack>
    );
}