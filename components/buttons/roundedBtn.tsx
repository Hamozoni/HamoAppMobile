import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, ViewStyle, StyleProp } from "react-native";

interface RoundedBtnProps {
    iconName: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    styles?: StyleProp<ViewStyle>;
    size?: number;
    color?: string;
}

export const RoundedBtn = ({ iconName, onPress = () => { }, styles, size = 24, color = "black" }: RoundedBtnProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[{ justifyContent: "center", alignItems: "center", borderRadius: 50, padding: 10 }, styles]}>
            <Ionicons name={iconName} size={size} color={color} />
        </TouchableOpacity>
    );
};
