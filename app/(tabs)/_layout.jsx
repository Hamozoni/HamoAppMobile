import { Tabs, useGlobalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const RootLayout = () => {

    const { isEdit } = useGlobalSearchParams();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#2983ceff",
                tabBarLabelStyle: {
                    display: "none",
                },
                tabBarStyle: {
                    display: isEdit ? "none" : "flex",
                },

            }}
        >
            <Tabs.Screen
                name="contacts"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialCommunityIcons name={focused ? "contacts" : "contacts-outline"} size={size + 5} color={color} />
                    ),
                    tabBarIconStyle: {
                        transform: [{ translateY: 20 }],
                    },
                }}
            />
            <Tabs.Screen
                name="calls"
                options={{
                    headerShown: false,
                    title: "Calls",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "call" : "call-outline"} size={size + 5} color={color} />
                    ),
                    tabBarIconStyle: {
                        transform: [{ translateY: 5 }],
                    },

                }} />
            <Tabs.Screen
                name="chat"
                options={{
                    headerShown: false,
                    title: "Chats",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={size + 15} color={color} />
                    ),
                    tabBarIconStyle: {
                        transform: [{ translateY: -25 }],
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        height: 60,
                        width: 60,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#e4f1f5ff",


                    },
                    tabBarLabelStyle: {
                        display: "none",
                        // transform: [{ translateY: -20 }],
                    },

                }} />

            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    title: "Profile",
                    tabBarIcon: ({ focused, size, color }) => (
                        <Ionicons name="qr-code-outline" size={size + 5} color={color} />
                    ),
                    tabBarIconStyle: {
                        transform: [{ translateY: 5 }],
                    },
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    headerShown: false,
                    title: "Settings",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? "cog" : "cog-outline"} size={size + 5} color={color} />
                    ),
                    tabBarIconStyle: {
                        transform: [{ translateY: 20 }],
                    },
                }}
            />
        </Tabs>
    );
};

export default RootLayout;
