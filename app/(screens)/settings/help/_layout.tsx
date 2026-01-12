import React from "react";
import { Stack } from "expo-router";
import ChevronBackBtn from "../../../../components/buttons/chevronBackBtn";
import { Text, View } from "react-native";

export default function SettingsHelpLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: () => (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: "#353535ff" }}>
                                SudaChat App
                            </Text>
                            <Text style={{ fontSize: 14, fontWeight: '400', color: "#9b9898ff" }}>
                                Version 1.0.0
                            </Text>
                        </View>
                    ),
                    headerTransparent: true,
                    headerLeft: () => (<ChevronBackBtn />)
                }}
            />
        </Stack>
    );
}
