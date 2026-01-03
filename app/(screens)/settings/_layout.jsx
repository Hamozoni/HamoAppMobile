import { Stack, useRouter } from "expo-router";
import { RoundedBtn } from "../../../components/ui/roundedBtn";
import { TouchableOpacity, Text } from "react-native";

export default function SettingsLayout() {
    const router = useRouter();
    return (
        <Stack  >
            <Stack.Screen
                name="lists"
                options={{
                    title: "Lists",
                    headerLeft: () => (
                        <RoundedBtn iconName='chevron-back' onPress={() => router.back()} />
                    ),
                    headerRight: () => (
                        <TouchableOpacity>
                            <Text>Record</Text>
                        </TouchableOpacity>
                    )
                }}
            />

            <Stack.Screen
                name="broadcasts"
                options={{
                    title: "Broadcasts messages",
                    headerLeft: () => (
                        <RoundedBtn iconName='chevron-back' onPress={() => router.back()} />
                    ),
                }}
            />
            <Stack.Screen
                name="starred"
                options={{
                    title: "Starred",
                    headerLeft: () => (
                        <RoundedBtn iconName='chevron-back' onPress={() => router.back()} />
                    ),
                    headerRight: () => (
                        <TouchableOpacity>
                            <Text>Edit</Text>
                        </TouchableOpacity>
                    )
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