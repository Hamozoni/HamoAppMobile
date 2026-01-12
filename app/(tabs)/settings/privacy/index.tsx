import React from "react";
import { ScrollView, Text, View } from "react-native";
import ThemedSafeAreaView from "../../../../components/themedViews/safeAreaView";
import ThemedViewContainer from "../../../../components/themedViews/ThemedViewContainer";
import TitleForwardIconBtn from "../../../../components/buttons/titleForwardIconBtn";
import Seprater from "../../../../components/ui/separator";
import Separator from "../../../../components/ui/separator";
import SwitchedBtn from "../../../../components/buttons/switchedBtn";

interface PrivacyItem {
    id: number;
    title: string;
    selected?: string;
    link: string;
    description?: string;
    subtitle?: string;
}

const PRIVACY: PrivacyItem[] = [
    {
        id: 1,
        title: "Last seen & online",
        selected: "Nobody",
        link: "/settings/privacy/lastSeen",
    },
    {
        id: 2,
        title: "Profile Photo",
        selected: "Nobody",
        link: "/settings/privacy/photo",
    },
    {
        id: 3,
        title: "About",
        selected: "Nobody",
        link: "/settings/privacy/about",
    },
    {
        id: 4,
        title: "Links",
        selected: "Nobody",
        link: "/settings/privacy/links",
    },
    {
        id: 5,
        title: "Groups",
        selected: "Nobody",
        link: "/settings/privacy/groups",
    },
    {
        id: 6,
        title: "Avatar",
        selected: "Nobody",
        link: "/settings/privacy/avatar",
    },
    {
        id: 7,
        title: "Status",
        selected: "Nobody",
        link: "/settings/privacy/status",
    },
];

const PRIVACY2: PrivacyItem[] = [
    {
        id: 1,
        title: "Live Location",
        selected: "Nobody",
        link: "/settings/privacy/liveLocation",
        description: "list of chats where you are sharing your live location",
    },
    {
        id: 2,
        title: "Calls",
        link: "/settings/privacy/calls",
    },
    {
        id: 3,
        title: "Contacts",
        selected: "Nobody",
        link: "/settings/privacy/contacts",
    },
    {
        id: 4,
        title: "Default messages timer",
        link: "/settings/privacy/defaultMessagesTimer",
        subtitle: "Disappearing messages",
        selected: "Off",
        description: "Start new chats with disappearing messages set to your timer."
    },
    {
        id: 5,
        title: "App lock",
        description: "Protect your app with a passcode, fingerprint, or face ID.",
        link: "/settings/privacy/appLock",
    },
    {
        id: 6,
        title: "Chat lock",
        description: "Protect your chats with a passcode, fingerprint, or face ID.",
        link: "/settings/privacy/chatLock",
    },
    {
        id: 7,
        title: "Advanced",
        link: "/settings/privacy/advanced",
    },
    {
        id: 8,
        title: "Privacy checkup",
        link: "/settings/privacy/privacyCheckup",
    }
];

export default function SettingsPrivacy() {
    return (
        <ThemedSafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
                <Separator />
                <ThemedViewContainer>
                    {
                        PRIVACY.map((item, index, array) => (
                            <TitleForwardIconBtn
                                key={item.id}
                                title={item.title}
                                link={item.link}
                                selected={item?.selected}
                                isLast={index === array.length - 1}
                            />
                        ))
                    }
                </ThemedViewContainer>
                <Separator height={40} />
                <ThemedViewContainer>
                    <SwitchedBtn title="Read receipts" isSwitched={true} onValueChange={() => { }} />
                </ThemedViewContainer>
                <Text style={{ fontSize: 14, paddingHorizontal: 15, color: '#7a7979ff', marginTop: 10 }}>
                    If you turn off read receipts, you won't be able to see read receipts from other users. Read receipts are always sent for group chats.
                </Text>
                <Separator />
                {
                    PRIVACY2.map((item) => (
                        <View key={item.id}>
                            {
                                item.subtitle && (
                                    <>
                                        <Text style={{ fontSize: 14, fontWeight: '500', marginHorizontal: 15, color: "#5f5959ff" }}>
                                            {item.subtitle}
                                        </Text>
                                        <Seprater height={10} />
                                    </>
                                )
                            }
                            <ThemedViewContainer >
                                <TitleForwardIconBtn
                                    title={item.title}
                                    selected={item?.selected}
                                    link={item.link}
                                    isLast={true}
                                />
                            </ThemedViewContainer>
                            {
                                item.description && (
                                    <>
                                        <Seprater height={10} />
                                        <Text style={{ fontSize: 12, marginHorizontal: 15, fontWeight: '500', color: "#868686ff" }}>
                                            {item.description}
                                        </Text>
                                    </>
                                )
                            }
                            <Seprater height={30} />
                        </View>
                    ))
                }
                <ThemedViewContainer>
                    <SwitchedBtn title="Allow camera effects" isSwitched={true} onValueChange={() => { }} />
                </ThemedViewContainer>
                <Text style={{ fontSize: 14, paddingHorizontal: 15, color: '#7a7979ff', marginTop: 10 }}>
                    Use effects in the camera and video calls.
                </Text>
                <Separator height={30} />
            </ScrollView>
        </ThemedSafeAreaView>
    );
}
