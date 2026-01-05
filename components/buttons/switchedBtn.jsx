import { Switch, Text, View } from "react-native";
import ThemedViewContainer from "../themedViews/ThemedViewContainer";

export default function SwitchedBtn({ title, isSwitched, onValueChange }) {
    return (
        <ThemedViewContainer >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7, paddingHorizontal: 5 }}>
                <Text style={{ flex: 1, fontSize: 16, fontWeight: 500, color: "#5f5959ff" }}>
                    {title}
                </Text>
                <Switch value={isSwitched} onValueChange={onValueChange} />
            </View>
        </ThemedViewContainer>
    )
}