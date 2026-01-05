import { Stack } from "expo-router";
import { RoundedBtn } from "../../../../components/buttons/roundedBtn";


export default function SettingsStorageLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    title: "Storage and data",
                    headerLeft: () => (
                        <RoundedBtn iconName="chevron-back" onPress={() => router.back()} />
                    )
                }}
            />
        </Stack>
    );
}