import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons";


export default function TitleForwarIconBtn(
    { iconName = null,
        title,
        link,
        isLast = false,
        selectet = null,
    }) {

    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => { router.push(link) }}
            style={[styles.container, { borderBottomWidth: isLast ? 0 : 1 }]}>
            {
                iconName && (
                    <Ionicons name={iconName} size={20} color="#555353ff" />
                )
            }
            <Text style={{ flex: 1, fontSize: 16, fontWeight: 500, color: "#5f5959ff" }}>
                {title}
            </Text>
            {
                selectet && (
                    <Text style={{ fontSize: 14, fontWeight: 500, color: "#5f5959ff" }}>
                        {selectet}
                    </Text>
                )
            }
            <Ionicons name="chevron-forward" size={18} color="#7a7979ff" />
        </TouchableOpacity >
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        gap: 5,
        paddingHorizontal: 5,
        paddingVertical: 15,
        borderBottomColor: "#e5e5e5ff"
    }
});