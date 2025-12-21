
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CHATS } from "../../../constants/chats";
import ChatsLists from "../../../components/chats/chatsLists";
import { SearchInput } from "../../../components/ui/searchInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";


const Button = ({ title, active = false }) => {
    return (
        <TouchableOpacity
            style={{
                paddingHorizontal: 15,
                borderRadius: 15,
                backgroundColor: active ? "rgba(156, 240, 240, 1)" : "transparent",
                borderColor: "#eee",
                borderWidth: 2,
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginRight: 5
            }}>
            <Text style={{ color: active ? "#000000ff" : "gray", fontSize: 18, fontWeight: "medium" }}>{title}</Text>
        </TouchableOpacity>
    );
}

const Chats = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 10, paddingTop: 140 }}>
                    <View style={{ marginVertical: 10 }}>
                        <ScrollView horizontal contentContainerStyle={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: 50, maxHeight: 50 }} showsHorizontalScrollIndicator={false}>
                            <Button title="All" active={true} />
                            <Button title="Unread" />
                            <Button title="Favorite" />
                            <Button title="Groups" />
                            <Button title="Communities" />
                        </ScrollView>

                    </View>
                    <ChatsLists chats={CHATS} />

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Chats; 