import { Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { RoundedBtn } from "../../../components/buttons/roundedBtn";


export default function ChatLayout() {

    const router = useRouter();
    return <Stack>
        <Stack.Screen
            name="index"
            options={{
                title: "Chats",
                headerTransparent: true,
                headerLargeTitle: true,
                headerSearchBarOptions: {
                    placeholder: "Search",
                },
                headerRight: () => (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <RoundedBtn iconName="camera" color="#1078b9ff" size={26} onPress={() => {
                            router.push("/chat/camera");
                        }} />
                        <RoundedBtn iconName="create-outline" color="#1078b9ff" size={26} onPress={() => {
                            router.push("/chat/contacts");
                        }} />

                    </View>
                ),
            }}
        />
        <Stack.Screen
            name="camera"
            options={{
                headerTransparent: true,
                presentation: "fullScreenModal",
                animation: "flip",
                headerShown: false,
                gestureEnabled: false,
                tabBarVisible: false,
            }}
        />
        <Stack.Screen
            name="contacts"
            options={{
                headerTransparent: true,
                title: "New Chat",
                headerShown: true,
                presentation: "modal",
                headerRight: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={26} />
                    </TouchableOpacity>
                ),
                headerSearchBarOptions: {
                    placeholder: "Search name or number",
                },

            }}
        />
    </Stack>
}