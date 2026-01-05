import { Text, TouchableOpacity, View } from "react-native";
import { StatusPanel } from "../../../components/status/statusPanel";
import { CHATS } from "../../../constants/chats";
import { ChatCard } from "../../../components/cards/chatCard";
import { FlatList } from "react-native-gesture-handler";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";

const Updates = () => {
    return (
        <ThemedSafeAreaView>
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                data={CHATS}
                renderItem={({ item }) => <ChatCard chat={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 5 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (

                    <View >
                        <StatusPanel />
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingTop: 30 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Channels</Text>
                            <TouchableOpacity >
                                <Text style={{ fontSize: 14, color: "#424141ff", fontWeight: "bold", borderRadius: 15, backgroundColor: "#e7e7e7ff", paddingHorizontal: 10, paddingVertical: 5 }}>Explore</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </ThemedSafeAreaView>
    );
};

export default Updates;
