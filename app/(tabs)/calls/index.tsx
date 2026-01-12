import React from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { RoundedBtn } from "../../../components/buttons/roundedBtn";
import { CALLS } from "../../../constants/call";
import { CallCard } from "../../../components/cards/callCard";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import { Ionicons } from "@expo/vector-icons";

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface CallBtnItem {
    id: number;
    iconName: IoniconsName;
    title: string;
    link: string;
}

const CALLSBTN: CallBtnItem[] = [
    {
        id: 1,
        iconName: "call-outline",
        title: "Call",
        link: "/calls/call"
    },
    {
        id: 2,
        iconName: "calendar-outline",
        title: "Schedulr",
        link: "/calls/schedulr"
    },
    {
        id: 3,
        iconName: "keypad-outline",
        title: "Keypad",
        link: "/calls/keypad"
    },
    {
        id: 4,
        iconName: "heart-outline",
        title: "Favorite",
        link: "/calls/favorite"
    },
];

const Calls = () => {
    return (
        <ThemedSafeAreaView>
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                data={CALLS}
                renderItem={({ item }) => <CallCard call={item} />}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 5, padding: 5 }}
                ListHeaderComponent={() => (
                    <View >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 15 }}>
                            {
                                CALLSBTN.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={{
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 5
                                        }}>
                                        <RoundedBtn iconName={item.iconName} size={30} styles={{ backgroundColor: "#eee" }} />
                                        <Text>{item.title}</Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>
                            Recent
                        </Text>
                    </View>
                )}
            />
        </ThemedSafeAreaView>
    );
};

export default Calls;
