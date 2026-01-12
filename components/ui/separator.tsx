import { View } from "react-native";
import { SeparatorProps } from "../../types/components.types";

export default function Separator({ height = 20 }: SeparatorProps) {
    return (
        <View style={{ height }}></View>
    )
}
