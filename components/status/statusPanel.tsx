import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { RoundedBtn } from "../buttons/roundedBtn";
import { STATUSES } from "../../constants/status";
import { StatusCard } from "../cards/statusCard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export const StatusPanel = () => {
    return (
        <View >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Status</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <RoundedBtn iconName="camera" />
                    <RoundedBtn iconName="pencil" />
                </View>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 5, paddingHorizontal: 20 }}>
                <View style={{ width: 100, height: 180, borderRadius: 15, borderWidth: 1, borderColor: "#ccc", flexDirection: "column", justifyContent: "space-around", alignItems: "center", }}>
                    <View style={{ padding: 10, alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <Image source={require("../../assets/icon.png")}
                            style={{ width: 60, height: 60, borderRadius: 30 }}
                        />
                        <TouchableOpacity style={{ position: "absolute", bottom: 10, right: 10, borderRadius: 12, backgroundColor: "#4ef16aff", borderWidth: 2, borderColor: "#ffffffff" }}>
                            <Ionicons name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ padding: 10 }}>
                        <Text>Add Status </Text>
                    </TouchableOpacity>
                </View>
                {
                    STATUSES.map((status: any, index: number) => (
                        <StatusCard key={status._id || index} status={status} index={index} />
                    ))
                }
            </ScrollView>
        </View>
    );
};
