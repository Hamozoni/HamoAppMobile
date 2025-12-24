
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ChatHeaderLeft, ChatHeaderRight, ChatHeaderMiddle } from "../../../components/chats/chatHeader";

export default function SettingLayout() {
    const router = useRouter();
    return (
        <Stack  >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    title: "Chats",
                    headerLargeTitle: true,
                    headerSearchBarOptions: {
                        placeholder: "Search",

                    },
                }}
            />
            <Stack.Screen
                name="[id]"
                options={
                    ({ route }) => {
                        const { id } = route.params;
                        return {
                            headerShown: true,
                            headerLeft: () => <ChatHeaderLeft id={id} />,
                            headerRight: () => <ChatHeaderRight id={id} />,
                            headerTitle: () => <ChatHeaderMiddle id={id} />,
                        }

                    }
                }
            />
            <Stack.Screen
                name="mediaGallery"
                options={{
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
                    gestureEnabled: false,
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
            <Stack.Screen
                name="camera"
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                    tabBarVisible: false,
                }}
            />
        </Stack>
    );
}