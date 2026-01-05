import { View } from "react-native";


export default function ThemedViewContainer({ children, paddingVertical = 0 }) {
    return (
        <View style={{ paddingHorizontal: 10, borderRadius: 10, backgroundColor: "#f8f8f8ff", paddingVertical }}>
            {children}
        </View>
    );
}