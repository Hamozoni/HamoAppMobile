import { ScrollView, Text, View } from "react-native";
import ThemedSafeAreaView from "../../../../components/themedViews/safeAreaView";
import ThemedViewContainer from "../../../../components/themedViews/ThemedViewContainer";
import TitleForwarIconBtn from "../../../../components/buttons/titleForwarIconBtn";
import Seprater from "../../../../components/ui/separator";

const PRIVACY = [
    {
        id: 1,
        title: "Last seen & online",
        selectet: "Nobody",
        link: "/settings/privacy/lastSeen",
    },
    {
        id: 2,
        title: "Profile Photo",
        selectet: "Nobody",
        link: "/settings/privacy/photo",
    },
    {
        id: 3,
        title: "About",
        selectet: "Nobody",
        link: "/settings/privacy/about",
    },
    {
        id: 4,
        title: "Links",
        selectet: "Nobody",
        link: "/settings/privacy/links",
    },
    {
        id: 5,
        title: "Groups",
        selectet: "Nobody",
        link: "/settings/privacy/groups",
    },
    {
        id: 6,
        title: "Avatar",
        selectet: "Nobody",
        link: "/settings/privacy/avatar",
    },
    {
        id: 7,
        title: "Status",
        selectet: "Nobody",
        link: "/settings/privacy/status",
    },
];

const PRIVACY2 = [
    {
        id: 1,
        title: "Live Location",
        selectet: "Nobody",
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
        selectet: "Nobody",
        link: "/settings/privacy/contacts",
    },
    {
        id: 4,
        title: "Default messages timer",
        selectet: "Nobody",
        link: "/settings/privacy/defaultMessagesTimer",
        subtitle: "Disappearing messages",
        selectet: "Off",
        description: "Start new chats with disappearing messages set to your timer."
    },
    {
        id: 5,
        title: "App lock",
        selectet: null,
        description: "Protect your app with a passcode, fingerprint, or face ID.",
        link: "/settings/privacy/appLock",
    },
    {
        id: 6,
        title: "Chat lock",
        selectet: null,
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
                <Seprater />
                <ThemedViewContainer>
                    {
                        PRIVACY.map((item, index, array) => (
                            <TitleForwarIconBtn
                                key={item.id}
                                title={item.title}
                                link={item.link}
                                selectet={item?.selectet}
                                isLast={index === array.length - 1}
                            />
                        ))
                    }
                </ThemedViewContainer>
                <Seprater height={40} />
                {
                    PRIVACY2.map((item) => (
                        <View key={item.id}>
                            {
                                item.subtitle && (
                                    <>
                                        <Text style={{ fontSize: 14, fontWeight: 500, marginHorizontal: 15, color: "#5f5959ff" }}>
                                            {item.subtitle}
                                        </Text>
                                        <Seprater height={10} />
                                    </>
                                )
                            }

                            <ThemedViewContainer >
                                <TitleForwarIconBtn
                                    title={item.title}
                                    selectet={item?.selectet}
                                    link={item.link}
                                    isLast={true}
                                />
                            </ThemedViewContainer>
                            {
                                item.description && (
                                    <>
                                        <Seprater height={10} />
                                        <Text style={{ fontSize: 12, marginHorizontal: 15, fontWeight: 500, color: "#868686ff" }}>
                                            {item.description}
                                        </Text>
                                    </>
                                )
                            }
                            <Seprater height={30} />
                        </View>
                    ))
                }
            </ScrollView>
        </ThemedSafeAreaView>
    );
}