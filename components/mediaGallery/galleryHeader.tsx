import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

export default function GalleryHeader() {
    const router = useRouter();
    return (
        <View >
            <View style={{ flexDirection: "row", alignItems: "center", }}>
                <TouchableOpacity onPress={() => { router.back() }}>
                    <Ionicons name="chevron-back" size={30} color="white" />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>John Doe</Text>
                        <Text style={{ color: "white", fontSize: 12 }}>12/12/2025,12:34</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
                        <TouchableOpacity>
                            <FontAwesome5 name="signature" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <MaterialCommunityIcons name="dots-vertical-circle-outline" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
