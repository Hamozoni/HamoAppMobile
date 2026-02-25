import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TEXT_PRIMARY = "#111B21";
const TEXT_SECONDARY = "#667781";

interface ProfileButton {
    iconName?: keyof typeof Ionicons.glyphMap | null; // ✅ not string
    title: string;
    link: string;
    selected?: string | null;
    isLast?: boolean | null;
}

export default function TitleForwardIconBtn({
    iconName = null,
    title,
    link,
    isLast = false,
    selected = null,
}: ProfileButton) {
    const router = useRouter();

    const iconColor = ICON_COLORS[
        (title?.charCodeAt(0) ?? 0) % ICON_COLORS.length
    ];

    return (
        <TouchableOpacity
            onPress={() => router.push(link as any)}
            activeOpacity={0.6}
            style={styles.row}
        >
            {/* Green icon circle */}
            {iconName && (
                <View style={[styles.iconCircle, { backgroundColor: iconColor.bg }]}>
                    <Ionicons name={iconName} size={24} color={iconColor.text} />
                </View>
            )}

            {/* Text + chevron */}
            <View style={[styles.content, !isLast && styles.contentBorder]}>
                <View style={styles.textBlock}>
                    <Text style={styles.title}>{title}</Text>
                    {selected && (
                        <Text style={styles.subtitle}>{selected}</Text>
                    )}
                </View>
                <Ionicons name="chevron-forward" size={16} color="#C8C8C8" />
            </View>
        </TouchableOpacity>
    );
};

const ICON_COLORS = [
    { bg: "#F0E6FF", text: "#7C3AED" },
    { bg: "#FEE2E2", text: "#DC2626" },
    { bg: "#DBEAFE", text: "#1D4ED8" },
    { bg: "#D1FAE5", text: "#065F46" },
    { bg: "#FEF3C7", text: "#92400E" },
    { bg: "#FCE7F3", text: "#9D174D" },
    { bg: "#E0F2FE", text: "#0369A1" },
    { bg: "#F3F4F6", text: "#374151" },
];


const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        // backgroundColor: "#fff",
    },
    iconCircle: {
        width: 35,
        height: 35,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
    },
    content: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingLeft: 14,
        paddingRight: 16,
    },
    contentBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E9ECEE",
    },
    textBlock: {
        flex: 1,
        gap: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: "500",
        color: TEXT_PRIMARY,
    },
    subtitle: {
        fontSize: 13,
        color: TEXT_SECONDARY,
        lineHeight: 18,
    },
});
