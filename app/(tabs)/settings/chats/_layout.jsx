import { Stack } from "expo-router";
import ChevronBackBtn from "../../../../components/buttons/chevronBackBtn";


export default function SettingsChatsLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    title: "Chats",
                    headerLeft: () => (<ChevronBackBtn />
                    )
                }}
            />
        </Stack>
    );
}