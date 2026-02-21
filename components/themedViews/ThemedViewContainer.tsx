import React from "react";
import { View, ViewStyle } from "react-native";

interface ThemedViewContainerProps {
    children: React.ReactNode;
    paddingVertical?: number;
    style?: ViewStyle;
}

export default function ThemedViewContainer({ children, paddingVertical = 10, style }: ThemedViewContainerProps) {
    return (
        <View style={[{ paddingHorizontal: 0, borderRadius: 10, backgroundColor: "#f5fcffff", paddingVertical }, style]}>
            {children}
        </View>
    );
}
