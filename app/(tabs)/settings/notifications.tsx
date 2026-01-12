import React from "react";
import { ScrollView, Text, View } from "react-native";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import SwitchedBtn from "../../../components/buttons/switchedBtn";
import TitleForwardIconBtn from "../../../components/buttons/titleForwardIconBtn";
import ThemedViewContainer from "../../../components/themedViews/ThemedViewContainer";
import Separator from "../../../components/ui/separator";

interface NotificationSubItem {
    id: number;
    title: string;
    isSwitched?: boolean;
    onValueChange?: () => void;
    selected?: string;
    link?: string;
}

interface NotificationCategory {
    id: number;
    title: string;
    data: NotificationSubItem[];
}

interface NotificationData2Item {
    id: number;
    title: string;
    isSwitched?: boolean;
    onValueChange?: () => void;
    description?: string;
    subtitle?: string;
    selected?: string;
    link?: string;
}

const notificationsData: NotificationCategory[] = [
    {
        title: "Message notifications",
        id: 1,
        data: [
            {
                id: 1,
                title: "Show notifications",
                isSwitched: false,
                onValueChange: () => { }
            },
            {
                id: 2,
                title: "Sound",
                selected: "none",
                link: "/settings/notifications/messagesound"
            },
            {
                id: 3,
                title: "Reaction notification",
                isSwitched: true,
                onValueChange: () => { }
            }
        ]
    },
    {
        title: "Group notifications",
        id: 2,
        data: [
            {
                id: 1,
                title: "Show notifications",
                isSwitched: false,
                onValueChange: () => { }
            },
            {
                id: 2,
                title: "Sound",
                selected: "none",
                link: "/settings/notifications/groupsound"
            },
            {
                id: 3,
                title: "Reaction notification",
                isSwitched: false,
                onValueChange: () => { }
            }
        ]
    },
    {
        title: "Status notifications",
        id: 3,
        data: [
            {
                id: 1,
                title: "Show notifications",
                isSwitched: true,
                onValueChange: () => { }
            },
            {
                id: 2,
                title: "Sound",
                selected: "none",
                link: "/settings/notifications/statussound"
            },
            {
                id: 3,
                title: "Reaction notification",
                selected: "none",
                link: "/settings/notifications/statusreaction"
            }
        ]
    },
];

const notificationsData2: NotificationData2Item[] = [
    {
        id: 1,
        title: "Reminders",
        isSwitched: false,
        onValueChange: () => { },
        description: "Get occasiional reminders about messages, calls or status updates you haven't seen.",
    },
    {
        id: 2,
        title: "Clear badge",
        subtitle: "Home screen notifications",
        isSwitched: true,
        onValueChange: () => { },
        description: "Your home screen badge clears completely after every time you open the app.",
    },
    {
        id: 3,
        title: "In-app notifications",
        selected: "Banners,Sounds,Vibration",
        link: "/settings/notifications/inappnotifications",
    },
    {
        id: 4,
        title: "Show preview",
        isSwitched: true,
        onValueChange: () => { },
        description: "Preview messages text inside new message notifications.",
    },
    {
        id: 5,
        title: "Reset notification settings",
        isSwitched: true,
        onValueChange: () => { },
        description: "Reset all notification settings, including custom notification settings. for your chats.",
    }
];

export default function SettingsNotifications() {
    return (
        <ThemedSafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
                {
                    notificationsData.map((item) => (
                        <View key={item.id}>
                            <Separator />
                            <Text style={{ fontSize: 16, fontWeight: '500', color: "#696868ff", paddingHorizontal: 15, marginVertical: 10 }}>{item.title}</Text>
                            <ThemedViewContainer>
                                {
                                    item.data.map((dataItem, index) => (
                                        dataItem.selected ? (
                                            <TitleForwardIconBtn
                                                key={dataItem.id}
                                                title={dataItem.title}
                                                link={dataItem.link ?? ""}
                                                isLast={item.data.length === index + 1}
                                                selected={dataItem?.selected}
                                            />
                                        ) : (
                                            <SwitchedBtn
                                                key={dataItem.id}
                                                title={dataItem.title}
                                                isSwitched={dataItem.isSwitched ?? false}
                                                onValueChange={dataItem.onValueChange ?? (() => { })}
                                                isLast={item.data.length === index + 1}
                                            />
                                        )
                                    ))
                                }
                            </ThemedViewContainer>
                        </View>
                    ))
                }
                <Separator />
                {
                    notificationsData2.map((item) => (
                        <View key={item.id}>
                            {
                                item.subtitle ? (
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: "#696868ff", paddingHorizontal: 15, marginVertical: 10 }}>{item.subtitle}</Text>
                                ) : null
                            }
                            <ThemedViewContainer>
                                {
                                    item.isSwitched !== undefined ? (
                                        <SwitchedBtn
                                            key={item.id}
                                            title={item.title}
                                            isSwitched={item.isSwitched}
                                            onValueChange={item.onValueChange ?? (() => { })}
                                            isLast={true}
                                        />
                                    ) : (
                                        <TitleForwardIconBtn
                                            key={item.id}
                                            title={item.title}
                                            link={item.link ?? ""}
                                            selected={item?.selected}
                                            isLast={true}
                                        />
                                    )
                                }
                            </ThemedViewContainer>
                            {
                                item.description ? (
                                    <Text style={{ fontSize: 14, fontWeight: '500', color: "#696868ff", paddingHorizontal: 15, marginVertical: 10 }}>{item.description}</Text>
                                ) : null
                            }
                            <Separator />
                        </View>
                    ))
                }
                <Separator />
            </ScrollView>
        </ThemedSafeAreaView>
    );
}
