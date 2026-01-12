import React from "react";
import { Stack } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import ChevronBackBtn from "../../../../components/buttons/chevronBackBtn";

export default function SettingsListsLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTransparent: true,
                    title: "Lists",
                    headerLeft: () => (<ChevronBackBtn />),
                    headerRight: () => (
                        <TouchableOpacity>
                            <Text style={{ fontSize: 18, fontWeight: '500', color: "#2d2e2dff" }}>Record</Text>
                        </TouchableOpacity>
                    )
                }}
            />
        </Stack>
    )
}
