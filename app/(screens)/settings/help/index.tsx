import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import ThemedSafeAreaView from "../../../../components/themedViews/safeAreaView";
import ThemedViewContainer from "../../../../components/themedViews/ThemedViewContainer";
import TitleForwardIconBtn from "../../../../components/buttons/titleForwardIconBtn";
import Separator from "../../../../components/ui/separator";

const HelpCenterImage = require("../../../../assets/images/helpCenter.png");

interface HelpItem {
    id: number;
    title: string;
    selected?: string;
    link: string;
}

interface HelpSection {
    id: number;
    data: HelpItem[];
}

const HELPDATA: HelpSection[] = [
    {
        id: 1, data: [
            {
                id: 1,
                title: "Help Center",
                selected: "Get help, contact us",
                link: "https://hamoapp.com/help-center",
            },
            {
                id: 2,
                title: "Send feedback",
                selected: "Report Technical issues",
                link: "settings/help/feedback",
            },
        ]
    },
    {
        id: 2, data: [
            {
                id: 1,
                title: "Terms and Privacy Policy",
                link: "https://hamoapp.com/terms-and-privacy-policy",
            },
            {
                id: 2,
                title: "Channel reports",
                link: "settings/help/channel-reports",
            },
            {
                id: 3,
                title: "Licenses",
                link: "settings/help/licenses",
            },
        ]
    }
];

export default function SettingsHelp() {
    return (
        <ThemedSafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
                <View style={{ alignItems: "center", marginVertical: 20, justifyContent: "center" }}>
                    <Image
                        source={HelpCenterImage}
                        style={{ width: 350, height: 350 }}
                    />
                </View>
                {
                    HELPDATA.map((item) => (
                        <View key={item.id}>
                            <ThemedViewContainer >
                                {
                                    item.data.map((data, i, ar) => (
                                        <TitleForwardIconBtn
                                            key={data.id}
                                            title={data.title}
                                            selected={data?.selected}
                                            link={data.link}
                                            isLast={i === ar.length - 1}
                                        />
                                    ))
                                }
                            </ThemedViewContainer>
                            <Separator />
                        </View>
                    ))
                }
                <Text style={{ fontSize: 14, fontWeight: '400', textAlign: "center", color: "#807d7dff" }}>
                    &copy; {new Date().getFullYear()} Hamozoni. All rights reserved.
                </Text>
                <Separator />
            </ScrollView>
        </ThemedSafeAreaView>
    );
}
