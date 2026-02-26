import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Tabs, useGlobalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AnimatedBorder from "../../components/ui/animatedBorder";

const WA_GREEN = "#ffffffff";
const WA_DARK = "#acc6f8ff";
const INACTIVE = "#526169ff";
const TAB_BG = "#FFFFFF";

const TabBtn = (
    { children, focused }:
        { children: React.ReactElement, focused: boolean }
) => {
    return (
        <View style={[
            styles.centerBtn,
            { backgroundColor: focused ? WA_DARK : WA_GREEN, transform: `${focused ? 1.1 : 1}` }
        ]}>
            {children}
        </View>
    )
}

const RootLayout = () => {

    return (
        <Tabs
            initialRouteName="chats"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: WA_DARK,
                tabBarInactiveTintColor: INACTIVE,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: TAB_BG,
                    borderTopWidth: 3,
                    borderTopColor: WA_DARK,
                    height: Platform.OS === "ios" ? 85 : 65,
                    paddingBottom: Platform.OS === "ios" ? 25 : 8,
                    paddingTop: 8,
                    elevation: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.07,
                    shadowRadius: 10,
                },
            }}
        >
            {/* Contacts */}
            <Tabs.Screen
                name="contacts"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <TabBtn focused={focused}>
                            <MaterialCommunityIcons
                                name={focused ? "contacts" : "contacts-outline"}
                                size={focused ? 36 : 28}
                                color={focused ? TAB_BG : INACTIVE}
                            />
                        </TabBtn>
                    ),
                }}
            />

            {/* Calls */}
            <Tabs.Screen
                name="calls"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBtn focused={focused}>
                            <Ionicons
                                name={focused ? "call" : "call-outline"}
                                size={focused ? 38 : 28}
                                color={focused ? TAB_BG : INACTIVE}
                            />
                        </TabBtn>
                    ),
                }}
            />

            {/* Chats — center FAB style */}
            <Tabs.Screen
                name="chats"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBtn focused={focused}>
                            <Ionicons
                                name={focused ? "chatbubbles" : "chatbubbles-outline"}
                                size={focused ? 38 : 28}
                                color={focused ? TAB_BG : INACTIVE}
                            />
                        </TabBtn>
                    ),
                }}
            />
            {/* Settings */}
            <Tabs.Screen
                name="settings"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBtn focused={focused}>
                            <Ionicons
                                name={focused ? "cog" : "cog-outline"}
                                size={focused ? 48 : 28}
                                color={focused ? TAB_BG : INACTIVE}
                            />
                        </TabBtn>
                    ),
                }}
            />
        </Tabs>
    );
};



const styles = StyleSheet.create({
    tabIcon: {
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingTop: 2,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: WA_DARK,
    },

    // Center chat button
    centerBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        borderWidth: 3,
        borderColor: WA_GREEN,
        alignItems: "center",
        marginBottom: Platform.OS === "ios" ? 10 : 20,
        shadowColor: WA_GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 8
    },
});

export default RootLayout;
