
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ChatHeaderLeft, ChatHeaderRight, ChatHeaderMiddle } from "../../../components/chats/chatHeader";

export default function SettingLayout() {
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
                    headerLeft: () => (
                        <TouchableOpacity style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "#eeeeeeff", justifyContent: "center", alignItems: "center" }}>
                            <Ionicons name="ellipsis-horizontal" size={26} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity >
                                <Ionicons name="camera" size={26} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginLeft: 10, width: "auto", height: "auto", borderRadius: "50%", backgroundColor: "green", justifyContent: "center", alignItems: "center" }}>
                                <Ionicons name="add" size={26} color="white" />
                            </TouchableOpacity>

                        </View>
                    ),
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
        </Stack>
    );
}