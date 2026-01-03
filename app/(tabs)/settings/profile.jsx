import { Image, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ProfileInput = ({ label, value }) => {
    return (
        <View style={{ marginBottom: 30 }}>
            <Text style={{ paddingHorizontal: 10, fontSize: 16, fontWeight: "500", color: "#6d6c6cff", marginBottom: 5 }}>{label}</Text>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 10, backgroundColor: "#eee", padding: 10, borderWidth: 1, borderColor: "#e7e6e6ff" }}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>{value}</Text>
                <Ionicons name="chevron-forward" size={18} color="rgba(109, 110, 110, 1)" />
            </TouchableOpacity>
        </View>
    );
};

const profileData = [
    { label: "Name", value: "John Doe" },
    { label: "About", value: "at work" },
    { label: "Phone", value: "+1234567890" },
];

export default function Profile() {
    return (
        <View style={{ paddingHorizontal: 10 }}>
            <View style={{ alignItems: "center", marginVertical: 20 }}>
                <TouchableOpacity style={{ alignItems: "center", marginBottom: 10 }}>
                    <Image
                        source={require("../../../assets/images/pexels-al-amin-muhammad-988616478-29680723.jpg")}
                        style={{ width: 150, height: 150, borderRadius: "50%", backgroundColor: "#e4f7c2ff" }}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#095e06ff" }}>Change Profile Photo</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20 }}>
                {profileData.map((item) => (
                    <ProfileInput key={item.label} label={item.label} value={item.value} />
                ))}
            </View>
        </View>
    );
};