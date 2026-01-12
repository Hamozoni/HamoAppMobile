import React from "react";
import { ScrollView, Text, View } from "react-native";
import ThemedSafeAreaView from "../../../../components/themedViews/safeAreaView";
import TitleForwardIconBtn from "../../../../components/buttons/titleForwardIconBtn";
import ThemedViewContainer from "../../../../components/themedViews/ThemedViewContainer";
import Separator from "../../../../components/ui/separator";
import SwitchedBtn from "../../../../components/buttons/switchedBtn";

interface SettingsItem {
    id: number;
    title: string;
    link: string;
    description?: string;
}

const CHATSSETTINGS: SettingsItem[] = [
    {
        id: 1,
        title: "Default chat theme",
        link: "/settings/chats/theme",
    },
    {
        id: 2,
        title: "Animations",
        link: "/settings/chats/animations",
        description: "Choose whether emoji, stickers and GIFs move automatically"
    },
    {
        id: 3,
        title: "Chat backup",
        link: "/settings/chats/backup",
    },
    {
        id: 4,
        title: "Export chat",
        link: "/settings/chats/export",
    },
    {
        id: 5,
        title: "Voice message transcripts",
        link: "/settings/chats/voice",
    },
];

const CHATSSETTINGS2: SettingsItem[] = [
    {
        id: 6,
        title: "Archive all chats",
        link: "/settings/chats/archive",
    },
    {
        id: 7,
        title: "Clear all chats",
        link: "/settings/chats/clear",
    },
    {
        id: 8,
        title: "Delete all chats",
        link: "/settings/chats/delete",
    },
];

export default function SettingsChats() {
    return (
        <ThemedSafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Separator />
                {
                    CHATSSETTINGS.map((item) => (
                        <View key={item.id}>
                            <ThemedViewContainer>
                                <TitleForwardIconBtn
                                    title={item.title}
                                    link={item.link}
                                    selected={item.description}
                                    isLast={true}
                                />
                            </ThemedViewContainer>
                            {
                                item.description && (
                                    <Text style={{ fontSize: 12, paddingHorizontal: 15, color: '#888888ff', marginTop: 5 }}>{item.description}</Text>
                                )
                            }
                            <Separator />
                        </View>
                    ))
                }
                <ThemedViewContainer>
                    <SwitchedBtn title="Stave to photos" isSwitched={true} onValueChange={() => { }} />
                </ThemedViewContainer>
                <Text style={{ fontSize: 14, paddingHorizontal: 15, color: '#7a7979ff', marginTop: 10 }}>
                    Automatically save photos and videos to your device
                </Text>
                <Separator />
                <ThemedViewContainer>
                    <SwitchedBtn title="Keep chats archived" isSwitched={true} onValueChange={() => { }} />
                </ThemedViewContainer>
                <Text style={{ fontSize: 14, paddingHorizontal: 15, color: '#7a7979ff', marginTop: 10 }}>
                    Archived chats will remain archived when you receive a new message
                </Text>
                <Separator />
                <ThemedViewContainer>
                    <TitleForwardIconBtn
                        title="Move chats to Android"
                        link="/settings/chats/android"
                    />
                    <TitleForwardIconBtn
                        title="Transfer chats to iPhone"
                        link="/settings/chats/iphone"
                        isLast={true}
                    />
                </ThemedViewContainer>
                <Separator />
                <ThemedViewContainer >
                    {
                        CHATSSETTINGS2.map((item, index) => (
                            <TitleForwardIconBtn
                                key={item.id}
                                title={item.title}
                                link={item.link}
                                isLast={index === CHATSSETTINGS2.length - 1}
                            />
                        ))
                    }
                </ThemedViewContainer>
                <Separator height={30} />
            </ScrollView>
        </ThemedSafeAreaView>
    );
}
