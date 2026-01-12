import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SettingsLinkedDevices() {
    return (
        <ThemedSafeAreaView>
            <View style={{ flex: 1, justifyContent: "space-between" }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Image
                        source={require("../../../assets/images/linkDevices.png")}
                        style={{ width: 200, height: 200 }}
                    />
                    <Text
                        style={{ maxWidth: 250, fontSize: 22, color: "#1f1f1fff", textAlign: "center", fontWeight: '700', marginBottom: 20 }}>Use SudaChat App on other devices</Text>
                    <Text style={{ paddingHorizontal: 20, fontSize: 16, color: "#808080ff", textAlign: "center", marginBottom: 20 }}> You can link your SudaShat account to other devices to access your chats and messages from anywhere. </Text>
                </View>
                <View>
                    <TouchableOpacity style={{ backgroundColor: "#47b863ff", padding: 10, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, color: "#fff", fontWeight: '500', textAlign: "center" }}>Link Device</Text>
                    </TouchableOpacity>
                    <View style={{ marginVertical: 15 }}>
                        <Text
                            style={{ fontSize: 14, color: "#808080ff", textAlign: "center" }}>
                            <Ionicons name="lock-closed" size={16} color="black" /> Your personal data is protected by <Link href="/settings/privacy" style={{ color: "#47b863ff" }}>end-to-end encryption</Link> on all of your devices.
                        </Text>
                    </View>
                </View>
            </View>
        </ThemedSafeAreaView>
    );
}
