import React from "react";
import { Stack } from "expo-router";
import ChevronBackBtn from "../../../components/buttons/chevronBackBtn";

export default function SettingLayout() {
    return (
        <Stack >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    title: "Settings",
                    headerLargeTitle: true,
                    headerSearchBarOptions: {
                        placeholder: "Search",
                    }
                }} />
            <Stack.Screen
                name="profile"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="linked"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    title: "Linked Devices",
                    headerLeft: () => (<ChevronBackBtn />)
                }}
            />
            <Stack.Screen
                name="account"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    title: "Account",
                    headerLeft: () => (<ChevronBackBtn />)
                }}
            />
            <Stack.Screen
                name="privacy"
                options={{
                    headerShown: false,
                    title: "Privacy"
                }}
            />
            <Stack.Screen
                name="chats"
                options={{
                    headerShown: false,
                    title: "Chats"
                }}
            />
            <Stack.Screen
                name="notifications"
                options={{
                    headerShown: true,
                    title: "Notifications",
                    headerTransparent: true,
                    headerLeft: () => (<ChevronBackBtn />)
                }}
            />
            <Stack.Screen
                name="storage"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="invite"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    title: "Invite a friend",
                    headerLeft: () => (<ChevronBackBtn />),
                    headerSearchBarOptions: {
                        placeholder: 'Search'
                    }
                }}
            />
        </Stack>
    );
}
