import React from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import { SafeAreaInsetsContext, SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface ThemedSafeAreaViewProps {
    children: React.ReactNode;
    style?: object;
}

export default function ThemedSafeAreaView({ children, style }: ThemedSafeAreaViewProps) {

    const insets = useSafeAreaInsets();
    return (
        <SafeAreaProvider>

            <SafeAreaView
                edges={["top", "bottom"]}
                style={[styles.container, style, { paddingTop: Platform.OS === "android" ? insets.top + 20 : 0 }]}>
                {children}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});