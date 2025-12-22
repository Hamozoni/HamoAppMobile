import { Tabs, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const RootLayout = () => {

    const segments = useSegments();

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
                    tabBarStyle: { display: segments.length === 2 ? "flex" : "none" },
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
                name="chats"
                options={{
                    headerShown: false,
                    tabBarStyle: { display: segments.length === 2 ? "flex" : "none" },

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
