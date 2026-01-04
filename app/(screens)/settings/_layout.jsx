import { Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import ChevronBackBtn from "../../../components/buttons/chevronBackBtn";

export default function SettingsLayout() {
    return (
        <Stack  >
            <Stack.Screen
                name="lists"
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="broadcasts"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="starred"
                options={{
                    headerTransparent: true,
                    title: "Starred",
                    headerLeft: () => (<ChevronBackBtn />),
                    headerRight: () => (
                        <TouchableOpacity>
                            <Text style={{ fontSize: 18, fontWeight: 500, color: "#47b863ff" }}>Edit</Text>
                        </TouchableOpacity>
                    ),
                    headerSearchBarOptions: {
                        placeholder: "Search",
                    }
                }}
            />
            <Stack.Screen
                name="help"
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    );
}