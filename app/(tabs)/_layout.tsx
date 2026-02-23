import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Tabs, useGlobalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const WA_GREEN = "#ffffffff";
const WA_DARK = "#1b7fc2ff";
const INACTIVE = "#526169ff";
const TAB_BG = "#FFFFFF";

const RootLayout = () => {
    const { isEdit } = useGlobalSearchParams<{ isEdit?: string }>();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: WA_DARK,
                tabBarInactiveTintColor: INACTIVE,
                tabBarShowLabel: false,
                tabBarStyle: {
                    display: isEdit === "true" ? "none" : "flex",
                    backgroundColor: TAB_BG,
                    borderTopWidth: 3,
                    borderTopColor: "#acc6f8ff",
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
                        <View style={[
                            styles.centerBtn,
                            { borderColor: focused ? WA_DARK : WA_GREEN }
                        ]}>
                            <MaterialCommunityIcons
                                name={focused ? "contacts" : "contacts-outline"}
                                size={28}
                                color={focused ? TAB_BG : INACTIVE}
                            />
                        </View>
                    ),
                }}
            />

            {/* Calls */}
            <Tabs.Screen
                name="calls"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={[
                            styles.centerBtn,
                            { borderColor: focused ? WA_DARK : WA_GREEN }
                        ]}>
                            <Ionicons
                                name={focused ? "call" : "call-outline"}
                                size={28}
                                color={focused ? TAB_BG : INACTIVE}
                            />
                        </View>
                    ),
                }}
            />

            {/* Chats — center FAB style */}
            <Tabs.Screen
                name="chats"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={[
                            styles.centerBtn,
                            { borderColor: focused ? WA_DARK : WA_GREEN }
                        ]}>
                            <Ionicons
                                name={focused ? "chatbubbles" : "chatbubbles-outline"}
                                size={28}
                                color={focused ? TAB_BG : INACTIVE}
                            />
                        </View>
                    ),
                }}
            />
            {/* Settings */}
            <Tabs.Screen
                name="settings"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={[
                            styles.centerBtn,
                            { borderColor: focused ? WA_DARK : WA_GREEN }
                        ]}>
                            <Ionicons
                                name={focused ? "cog" : "cog-outline"}
                                size={28}
                                color={focused ? TAB_BG : INACTIVE}
                            />
                        </View>
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
        alignItems: "center",
        borderWidth: 2,
        borderStyle: "dashed",
        marginBottom: Platform.OS === "ios" ? 10 : 20,
        shadowColor: WA_GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 8,
    },
});

export default RootLayout;
