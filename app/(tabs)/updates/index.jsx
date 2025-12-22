import { Text, TouchableOpacity, View } from "react-native";
import { StatusPanel } from "../../../components/status/statusPanel";
import { CHATS } from "../../../constants/chats";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatCard } from "../../../components/cards/chatCard";
import { FlatList } from "react-native-gesture-handler";

const Updates = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
            <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ flex: 1, padding: 10 }} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1 }}>
                    <StatusPanel />
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingTop: 30 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Channels</Text>
                        <TouchableOpacity >
                            <Text style={{ fontSize: 14, color: "#424141ff", fontWeight: "bold", borderRadius: 15, backgroundColor: "#e7e7e7ff", paddingHorizontal: 10, paddingVertical: 5 }}>Explore</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={CHATS}
                            renderItem={({ item }) => <ChatCard chat={item} />}
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

export default Updates;
