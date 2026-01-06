import { StyleSheet, Switch, Text, View } from "react-native";

export default function SwitchedBtn({ title, isSwitched, onValueChange, isLast = true }) {
    return (
        <View style={[styles.container, { borderBottomWidth: isLast ? 1 : 0 }]}>
            <Text style={{ flex: 1, fontSize: 16, fontWeight: 500, color: "#353535ff" }}>
                {title}
            </Text>
            <Switch value={isSwitched} onValueChange={onValueChange} />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        gap: 5,
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderBottomColor: "#e5e5e5ff"
    }
});