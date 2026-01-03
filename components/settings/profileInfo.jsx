import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export const ProfileInfo = () => {

    const router = useRouter();
    return (
        <View style={{ padding: 20, borderRadius: 20, backgroundColor: "#fff", marginVertical: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#eee", marginBottom: 20, paddingBottom: 20, gap: 10 }}>
                <TouchableOpacity onPress={() => router.push("/settings/profile")}>
                    <Image
                        source={require("../../assets/images/pexels-al-amin-muhammad-988616478-29680723.jpg")}
                        style={{ width: 60, height: 60, borderRadius: 50, backgroundColor: "#d6f897ff" }}
                    />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>John Doe</Text>
                        <Text style={{ fontSize: 16 }}>At work</Text>
                    </View>
                    <View>
                        <Ionicons name="qr-code-outline" size={28} color="#000" />
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="person-outline" size={20} color="#000" />
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                    <Text style={{ fontSize: 18, color: "#555353ff" }}>Avatar</Text>
                    <Ionicons name="chevron-forward" size={16} color="#616161ff" />
                </View>
            </View>
        </View>
    );
};