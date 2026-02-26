import React from "react";
import { ScrollView } from "react-native";
import { ProfileInfo } from "../../../components/settings/profileInfo";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import ThemedViewContainer from "../../../components/themedViews/ThemedViewContainer";
import Seprater from "../../../components/ui/separator";
import TitleForwardIconBtn from "../../../components/buttons/titleForwardIconBtn";
import { Ionicons } from "@expo/vector-icons";

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface SettingItem {
    id: number;
    title: string;
    iconName: IoniconsName;
    link: string;
}

const settingsData1: SettingItem[] = [
    { title: "Lists", iconName: "albums", id: 1, link: "/settings/lists" },
    { title: "Broadcasts messages", iconName: "megaphone", id: 2, link: "/settings/broadcasts" },
    { title: "Starred", iconName: "star", id: 3, link: "/settings/starred" },
    { title: "Linked devices", iconName: "laptop", id: 4, link: "/settings/linked" },
];

const settingsData2: SettingItem[] = [
    { title: "Account", iconName: "person", id: 5, link: "/settings/account" },
    { title: "Privacy", iconName: "lock-closed", id: 6, link: "/settings/privacy" },
    { title: "Chats", iconName: "chatbubbles", id: 7, link: "/settings/chats" },
    { title: "Notifications", iconName: "notifications", id: 8, link: "/settings/notifications" },
    { title: "Storage and data", iconName: "file-tray-stacked", id: 9, link: "/settings/storage" },
];

const settingsData3: SettingItem[] = [
    { title: "Help and feedback", iconName: "help-circle", id: 10, link: "/settings/help" },
    { title: "Invite a friend", iconName: "person-add", id: 11, link: "/settings/invite" },
];

const Settings = () => {
    return (
        <ThemedSafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ProfileInfo />
                <Seprater />
                <ThemedViewContainer>
                    {settingsData1.map((item, index, array) => (
                        <TitleForwardIconBtn
                            key={item.id}
                            iconName={item.iconName}
                            title={item.title}
                            link={item.link}
                            isLast={index === array.length - 1}
                        />
                    ))}
                </ThemedViewContainer>
                <Seprater />
                <ThemedViewContainer>
                    {settingsData2.map((item, index, array) => (
                        <TitleForwardIconBtn
                            isLast={index === array.length - 1}
                            key={item.id}
                            iconName={item.iconName}
                            title={item.title}
                            link={item.link}
                        />
                    ))}
                </ThemedViewContainer>
                <Seprater />
                <ThemedViewContainer>
                    {settingsData3.map((item, index, array) => (
                        <TitleForwardIconBtn
                            key={item.id}
                            iconName={item.iconName}
                            title={item.title}
                            link={item.link}
                            isLast={index === array.length - 1}
                        />
                    ))}
                </ThemedViewContainer>
                <Seprater height={30} />
            </ScrollView>
        </ThemedSafeAreaView>
    );
};

export default Settings;
