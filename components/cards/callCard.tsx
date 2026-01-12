import { Image, Text, TouchableOpacity, View, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Call } from "../../types/components.types";

interface CallCardProps {
    call: Call;
}

export const CallCard = ({ call }: CallCardProps) => {
    const imageSource: ImageSourcePropType = call?.caller?.photoURL
        ? { uri: call.caller.photoURL }
        : require("../../assets/images/pexels-al-amin-muhammad-988616478-29680723.jpg");

    return (
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 10, alignItems: "center" }}>
            <Image source={imageSource} style={{ width: 42, height: 42, borderRadius: 50, backgroundColor: "#ccc" }} />
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottomColor: "#eeebebff",
                    borderBottomWidth: 1,
                    paddingBottom: 10
                }}
            >
                <View style={{}}>
                    <Text style={{ fontSize: 14, fontWeight: "700" }}>{call?.caller?.displayName}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <Ionicons name="call-outline" size={14} color="black" />
                        <Text style={{ fontSize: 14, color: "#555353ff", fontWeight: "500" }}>{call?.status}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Text style={{ fontSize: 12, color: "#666", fontWeight: "bold" }}>{call?.caller?.created}</Text>
                    <TouchableOpacity>
                        <Ionicons name="alert-circle-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
