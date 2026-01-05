import { Text, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons";


export default function TitleForwarIconBtn({ iconName = null, title, link, isLast = false }) {

    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => { router.push(link) }}
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: 'space-between',
                gap: 5,
                paddingHorizontal: 10,
                paddingVertical: 15,
                borderBottomWidth: isLast ? 0 : 1,
                borderBottomColor: "#e5e5e5ff"
            }}>
            {
                iconName && (
                    <Ionicons name={iconName} size={20} color="#555353ff" />
                )
            }
            <Text style={{ flex: 1, fontSize: 16, fontWeight: 500, color: "#5f5959ff" }}>
                {title}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="black" />
        </TouchableOpacity >
    )
}