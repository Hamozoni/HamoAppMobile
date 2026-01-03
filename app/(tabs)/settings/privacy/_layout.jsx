import { Stack } from "expo-router";
import { RoundedBtn } from "../../../../components/ui/roundedBtn";


export default function PrivacyLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    title: "Privacy",
                    headerLeft: () => (
                        <RoundedBtn iconName="chevron-back" onPress={() => router.back()} />
                    )
                }}
            />
        </Stack>
    );
}