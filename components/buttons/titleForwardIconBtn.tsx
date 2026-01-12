import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface TitleForwardIconBtnProps {
    iconName?: keyof typeof Ionicons.glyphMap | null;
    title: string;
    link: string;
    isLast?: boolean;
    selected?: string | null;
}

export default function TitleForwardIconBtn({
    iconName = null,
    title,
    link,
    isLast = false,
    selected = null,
}: TitleForwardIconBtnProps) {

    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => { router.push(link as any) }}
            style={styles.container}>
            {
                iconName && (
                    <Ionicons name={iconName} size={20} color="#555353ff" />
                )
            }
            <View style={[styles.flexView, { paddingVertical: 15, borderBottomWidth: isLast ? 0 : 1, borderBottomColor: "#eee" }]} >
                <View style={[styles.flexView, { flexWrap: "wrap" }]}>
                    <Text style={{ fontSize: 16, fontWeight: "500", color: "#353535ff" }}>
                        {title}
                    </Text>
                    {
                        selected && (
                            <Text style={{ fontSize: 14, fontWeight: "400", color: "#5f5959ff" }}>
                                {selected}
                            </Text>
                        )
                    }

                </View>
                <Ionicons name="chevron-forward" size={18} color="#7a7979ff" />

            </View>
        </TouchableOpacity >
    )
}

const flexBox: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex: 1,
    justifyContent: "space-between",
};

const styles = StyleSheet.create({
    flexView: flexBox,
    container: {
        ...flexBox,
        paddingHorizontal: 5,
    }
});
