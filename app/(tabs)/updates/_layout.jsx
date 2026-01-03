import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function UpdatesLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    title: "Updates",
                    headerLargeTitle: true,
                    headerSearchBarOptions: {
                        placeholder: "Search",

                    },
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "#eeeeeeff", justifyContent: "center", alignItems: "center" }}>
                            <Ionicons name="ellipsis-horizontal" size={26} />
                        </TouchableOpacity>
                    )
                }} />
        </Stack>
    );
}