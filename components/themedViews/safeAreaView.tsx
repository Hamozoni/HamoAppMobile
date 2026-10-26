import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";

interface Props {
    children: React.ReactNode;
    style?: ViewStyle;
    edges?: Edge[];
}

export default function ThemedSafeAreaView({
    children,
    style,
    edges = ["top", "bottom"],
}: Props) {
    return (
        <SafeAreaView edges={edges} style={[styles.container, style]}>
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
});