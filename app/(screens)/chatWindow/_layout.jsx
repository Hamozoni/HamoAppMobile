
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { ChatHeaderLeft, ChatHeaderRight, ChatHeaderMiddle } from "../../../components/chats/chatHeader";

export default function SettingLayout() {
    const router = useRouter();
    return (
        <Stack  >
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
                name="shareContacts"
                options={{
                    title: "Share Contacts",
                    headerShown: true,
                    presentation: "modal",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>Cancel</Text>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>Next</Text>
                        </TouchableOpacity>
                    ),
                    headerSearchBarOptions: {
                        placeholder: "Search",
                    },

                }}
            />

            <Stack.Screen
                name="location"
                options={{
                    title: "Send Location",
                    headerShown: false,
                    presentation: "modal",

                }}
            />
        </Stack>
    );
}