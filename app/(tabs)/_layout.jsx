import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

const RootLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#02d85bff",
            }}
        >
            <Tabs.Screen
                name="updates"
                options={{
                    headerShown: false,
                    title: "Updates",
                    tabBarIcon: ({ focused, color, size }) => (
                        // <Image source={require("../../assets/application.png")} style={{ width: 24, height: 24 }} />
                        <Ionicons name={focused ? "notifications" : "notifications-outline"} size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="calls"
                options={{
                    headerShown: false,
                    title: "Calls",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "call" : "call-outline"} size={size} color={color} />
                    )

                }} />
            <Tabs.Screen
                name="communiies"
                options={{
                    headerShown: false,
                    title: "Communiies",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "people" : "people-outline"} size={size} color={color} />
                    )
                }}

            />

            <Tabs.Screen
                index={0}
                name="chats"
                options={{
                    headerShown: false,
                    title: "Chats",
                    tabBarIcon: ({ focused, size, color }) => (
                        <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    headerShown: false,
                    title: "Settings",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "cog" : "cog-outline"} size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    );
};

export default RootLayout;
