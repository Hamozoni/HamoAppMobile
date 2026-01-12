import React from "react";
import { Stack } from "expo-router";
import ChevronBackBtn from "../../../../components/buttons/chevronBackBtn";

export default function SettingsProfileLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    title: "Profile",
                    headerLeft: () => (<ChevronBackBtn />),
                }} />
        </Stack>
    );
}
