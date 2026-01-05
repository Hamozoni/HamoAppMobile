import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const RootLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#02d85bff",
                tabBarLabelStyle: {
                    fontSize: 12,
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
                        <Ionicons name={focused ? "call" : "call-outline"} size={focused ? size + 2 : size} color={color} />
                    )

                }} />
            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    title: "Profile",
                    tabBarIconStyle: {
                        transform: [{ translateY: -25 }],
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        height: 60,
                        width: 60,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#ebebebff",


                    },
                    tabBarLabelStyle: {
                        display: "none",
                    },
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name={"qr-code-outline"} size={size + 15} color={color} />
                    )

                }} />

            <Tabs.Screen
                name="chat"
                options={{
                    headerShown: false,
                    title: "Chats",
                    tabBarIcon: ({ focused, size, color }) => (
                        <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="settings"
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
