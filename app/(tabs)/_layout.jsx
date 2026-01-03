import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const RootLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#02d85bff",
                tabBarLabelStyle: {
                    fontSize: 14,
                },
            }}
        >
            <Tabs.Screen
                name="updates"
                options={{
                    headerShown: false,
                    title: "Updates",
                    tabBarIcon: ({ focused, color, size }) => (
                        // <Image source={require("../../assets/application.png")} style={{ width: 24, height: 24 }} />
                        <Ionicons name={focused ? "notifications" : "notifications-outline"} size={30} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="calls"
                options={{
                    headerShown: false,
                    title: "Calls",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "call" : "call-outline"} size={30} color={color} />
                    )

                }} />

            <Tabs.Screen
                name="chat"
                options={{
                    headerShown: false,
                    title: "Chats",
                    tabBarIcon: ({ focused, size, color }) => (
                        <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={30} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    headerShown: false,
                    title: "Settings",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "cog" : "cog-outline"} size={30} color={color} />
                    )
                }}
            />
        </Tabs>
    );
};

export default RootLayout;
