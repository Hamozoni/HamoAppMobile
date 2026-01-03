import { Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


export default function ChatLayout() {

    const router = useRouter();
    return <Stack>
        <Stack.Screen
            name="index"
            options={{
                title: "Chats",
                headerLargeTitle: true,
                headerSearchBarOptions: {
                    placeholder: "Search",
                },
                headerRight: () => (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => router.push("/chat/camera")} >
                            <Ionicons name="camera" size={26} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                router.push("/chat/contacts");
                            }}
                            style={{ marginLeft: 10, width: "auto", height: "auto", borderRadius: "50%", backgroundColor: "green", justifyContent: "center", alignItems: "center" }}>
                            <Ionicons name="add" size={26} color="white" />
                        </TouchableOpacity>

                    </View>
                ),
            }}
        />
        <Stack.Screen
            name="camera"
            options={{
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