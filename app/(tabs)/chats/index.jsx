
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { CHATS } from "../../../constants/chats";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { ChatCard } from "../../../components/cards/chatCard";
import { useState } from "react";
import { RoundedBtn } from "../../../components/ui/roundedBtn";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Button = ({ title, active, setActive }) => {
    return (
        <TouchableOpacity
            onPress={() => setActive(title)}
            style={{
                paddingHorizontal: 15,
                borderRadius: 15,
                backgroundColor: active === title ? "rgba(14, 218, 133, 1)" : "transparent",
                borderColor: "#eee",
                borderWidth: 2,
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginRight: 5,
                justifyContent: "center",
                alignItems: "center"
            }}>
            <Text style={{ color: active === title ? "#eee" : "gray", fontSize: 14, fontWeight: "600" }}>{title}</Text>
        </TouchableOpacity>
    );
}

const Chats = () => {

    const router = useRouter();

    const [activeButton, setActiveButton] = useState("All");
    return (
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <TouchableOpacity >
                            <Text style={{ fontSize: 18, color: "#1449f7ee", fontWeight: "600" }}>Edit</Text>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity onPress={() => router.push("/chats/camera")} >
                                <Ionicons name="camera" size={26} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    router.push("/chats/contacts");
                                }}
                                style={{ marginLeft: 10, width: "auto", height: "auto", borderRadius: "50%", backgroundColor: "green", justifyContent: "center", alignItems: "center" }}>
                                <Ionicons name="add" size={26} color="white" />
                            </TouchableOpacity>

                        </View>
                    ),
                }}
            />
            <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 10 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ paddingVertical: 20 }}>
                        <FlatList
                            data={["All", "Unread", "Favorite", "Groups", "Communities"]}
                            renderItem={({ item }) => <Button title={item} active={activeButton} setActive={setActiveButton} />}
                            keyExtractor={(item) => item}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />

                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={CHATS}
                            renderItem={({ item }) => (<ChatCard key={item.id} chat={item} />)}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ gap: 10 }}
                            showsVerticalScrollIndicator={false}
                        />

                    </View>

                </View>


            </ScrollView>
        </SafeAreaView>
    );
};

export default Chats; 