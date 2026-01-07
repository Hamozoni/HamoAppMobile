import { Stack } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { RoundedBtn } from "../../../components/buttons/roundedBtn";

export default function UpdatesLayout() {
    return (
        <Stack >
            <Stack.Screen
                name="index"
                options={{
                    headerTransparent: true,
                    headerShown: true,
                    title: "Calls",
                    headerLargeTitle: true,
                    headerSearchBarOptions: {
                        placeholder: "Search",
                    },
                    headerLeft: () => (
                        <TouchableOpacity>
                            <Text style={{ color: "#1078b9ff", fontWeight: "bold", fontSize: 18 }}>Edit</Text>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <RoundedBtn iconName="create-outline" color="#1078b9ff" size={26} />
                    )
                }} />
        </Stack>
    );
}