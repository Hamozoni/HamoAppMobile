import React from "react";
import { Stack, useRouter } from "expo-router";
import { RoundedBtn } from "../../../../components/buttons/roundedBtn";

export default function PrivacyLayout() {
    const router = useRouter();
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    title: "Privacy",
                    headerLeft: () => (
                        <RoundedBtn iconName="chevron-back" onPress={() => router.back()} />
                    )
                }}
            />
        </Stack>
    );
}
