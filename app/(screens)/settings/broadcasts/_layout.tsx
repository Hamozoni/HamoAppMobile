import React from "react";
import { Stack } from "expo-router";
import ChevronBackBtn from "../../../../components/buttons/chevronBackBtn";

export default function SettingsBroadcastsLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Broadcasts messages",
                    headerLeft: () => (<ChevronBackBtn />),
                }} />
        </Stack>
    );
}
