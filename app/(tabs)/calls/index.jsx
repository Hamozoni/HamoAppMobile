import { Text, View, FlatList } from "react-native";
import { RoundedBtn } from "../../../components/buttons/roundedBtn";
import { CALLS } from "../../../constants/call";
import { CallCard } from "../../../components/cards/callCard";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";


const Calls = () => {
    return (
        <ThemedSafeAreaView>


            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                data={CALLS}
                renderItem={({ item }) => <CallCard call={item} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                ListHeaderComponent={() => (
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 20 }}>
                            <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
                                <RoundedBtn iconName="call-outline" large={true} />
                                <Text>Call</Text>
                            </View>
                            <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
                                <RoundedBtn iconName="calendar-outline" large={true} />
                                <Text>Schedulr</Text>
                            </View>
                            <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
                                <RoundedBtn iconName="keypad-outline" large={true} />
                                <Text>Keypad</Text>
                            </View>
                            <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
                                <RoundedBtn iconName="heart-outline" large={true} />
                                <Text>Favorite</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>Recent</Text>
                    </View>
                )}
            />


        </ThemedSafeAreaView>
    );
};

export default Calls;