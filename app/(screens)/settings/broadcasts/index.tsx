import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import ThemedSafeAreaView from "../../../../components/themedViews/safeAreaView";

interface Broadcast {
    id: string;
    title: string;
}

const broadcasts: Broadcast[] = [];

export default function SettingsBroadcasts() {
    return (
        <ThemedSafeAreaView>
            <View style={{ flex: 1, justifyContent: "space-between" }}>
                <FlatList
                    data={broadcasts}
                    renderItem={({ item }) => (
                        <Text>{item.title}</Text>
                    )}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={() => (
                        <View style={{ height: 300, justifyContent: "flex-end", alignItems: "center", gap: 20 }}>
                            <Text style={{ fontSize: 18, color: "#808080ff", textAlign: "center" }}>You should use broadcast lists to message multiple contacts at once</Text>
                            <Text style={{ fontSize: 18, color: "#808080ff", textAlign: "center" }}>Only contacts with your phone number will receive messages sent to a broadcast list</Text>
                        </View>
                    )}
                />
                <View >
                    <TouchableOpacity style={{ alignSelf: "center" }}>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: "#47b863ff" }}>New list</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ThemedSafeAreaView>
    );
}
