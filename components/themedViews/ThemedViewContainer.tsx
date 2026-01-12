import React from "react";
import { View, ViewStyle } from "react-native";

interface ThemedViewContainerProps {
    children: React.ReactNode;
    paddingVertical?: number;
    style?: ViewStyle;
}

export default function ThemedViewContainer({ children, paddingVertical = 0, style }: ThemedViewContainerProps) {
    return (
        <View style={[{ paddingHorizontal: 10, borderRadius: 10, backgroundColor: "#f8f8f8ff", paddingVertical }, style]}>
            {children}
        </View>
    );
}
