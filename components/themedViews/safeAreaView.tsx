import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface ThemedSafeAreaViewProps {
    children: React.ReactNode;
}

export default function ThemedSafeAreaView({ children }: ThemedSafeAreaViewProps) {
    return (
        <SafeAreaProvider>
            <SafeAreaView
                edges={["top", "bottom"]}
                style={{ flex: 1, backgroundColor: "#ffffffff" }}>
                {children}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
