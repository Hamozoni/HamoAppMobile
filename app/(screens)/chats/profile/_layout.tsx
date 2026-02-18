import { Stack } from "expo-router";
import ChevronBackBtn from "../../../../components/buttons/chevronBackBtn";
import { Text, TouchableOpacity } from "react-native";



export default function ChatProfileLayout() {

    return (
        <Stack >
            <Stack.Screen
                name="[phoneNumber]"
                options={{
                    title: "Contact info",
                    headerShown: true,
                    headerLeft: () => (<ChevronBackBtn />),
                    headerRight: () => (
                        <TouchableOpacity  >
                            <Text style={{ fontSize: 18, color: "#1078b9ff", fontWeight: "bold" }}>Edit</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack>
    )
}