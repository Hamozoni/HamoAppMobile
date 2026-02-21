// import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// interface TitleForwardIconBtnProps {
//     iconName?: keyof typeof Ionicons.glyphMap | null;
//     title: string;
//     link: string;
//     isLast?: boolean;
//     selected?: string | null;
// }

// export default function TitleForwardIconBtn({
//     iconName = null,
//     title,
//     link,
//     isLast = false,
//     selected = null,
// }: TitleForwardIconBtnProps) {

//     const router = useRouter();
//     return (
//         <TouchableOpacity
//             onPress={() => { router.push(link as any) }}
//             style={styles.container}>
//             {
//                 iconName && (
//                     <Ionicons name={iconName} size={20} color="#555353ff" />
//                 )
//             }
//             <View style={[styles.flexView, { paddingVertical: 15, borderBottomWidth: isLast ? 0 : 1, borderBottomColor: "#eee" }]} >
//                 <View style={[styles.flexView, { flexWrap: "wrap" }]}>
//                     <Text style={{ fontSize: 16, fontWeight: "500", color: "#353535ff" }}>
//                         {title}
//                     </Text>
//                     {
//                         selected && (
//                             <Text style={{ fontSize: 14, fontWeight: "400", color: "#5f5959ff" }}>
//                                 {selected}
//                             </Text>
//                         )
//                     }

//                 </View>
//                 <Ionicons name="chevron-forward" size={18} color="#7a7979ff" />

//             </View>
//         </TouchableOpacity >
//     )
// }

// const flexBox: ViewStyle = {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//     flex: 1,
//     justifyContent: "space-between",
// };

// const styles = StyleSheet.create({
//     flexView: flexBox,
//     container: {
//         ...flexBox,
//         paddingHorizontal: 5,
//     }
// });



import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const WA_GREEN = "#25a2d3ab";
const TEXT_PRIMARY = "#111B21";
const TEXT_SECONDARY = "#667781";

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
            onPress={() => router.push(link as any)}
            activeOpacity={0.6}
            style={styles.row}
        >
            {/* Green icon circle */}
            {iconName && (
                <View style={styles.iconCircle}>
                    <Ionicons name={iconName} size={20} color="#fff" />
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
                <Ionicons name="chevron-forward" size={17} color="#C8C8C8" />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        // backgroundColor: "#fff",
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: WA_GREEN,
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
