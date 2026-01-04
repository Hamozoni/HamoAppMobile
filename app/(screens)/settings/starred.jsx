import { Text, View } from "react-native";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import { FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SettingsStarred() {
    return (
        <ThemedSafeAreaView>
            <FlatList
                data={[]}
                renderItem={({ item }) => (
                    <Text>{item.title}</Text>
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", gap: 20, height: 350 }}>
                        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#39dd62ff", borderRadius: "50%", width: 80, height: 80, borderWidth: 2, borderColor: "#1b1b1bff" }}>
                            <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#39dd62ff", borderRadius: "50%", width: 60, height: 60, borderWidth: 2, borderColor: "#1b1b1bff" }}>
                                <Ionicons name="star-outline" size={48} color="#1b1b1bff" />
                            </View>
                        </View>

                        <View>
                            <Text style={{ fontSize: 22, color: "#1f1f1fff", textAlign: "center", fontWeight: 700, marginBottom: 20 }}>No starred messages or updates</Text>
                            <Text style={{ fontSize: 18, color: "#808080ff", textAlign: "center" }}>Tap and hold on any message or channel update to star it, so you can find it here</Text>
                        </View>
                    </View>
                )}
            />
        </ThemedSafeAreaView>
    );
}