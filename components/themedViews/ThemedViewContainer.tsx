import React from "react";
import { View, ViewStyle, StyleSheet, Platform } from "react-native";

interface ThemedViewContainerProps {
    children: React.ReactNode;
    paddingVertical?: number;
    style?: ViewStyle;
}

export default function ThemedViewContainer({
    children,
    paddingVertical = 10,
    style,
}: ThemedViewContainerProps) {
    return (
        <View style={[styles.shadow, style]}>
            <View style={[styles.container, { paddingVertical }]}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // Outer wrapper carries the shadow (Android needs elevation on its own layer)
    shadow: {
        borderRadius: 14,
        backgroundColor: "#fff",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.07,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    container: {
        borderRadius: 14,
        backgroundColor: "#fff",
        overflow: "hidden", // clips children to rounded corners
        paddingHorizontal: 0,
    },
});
