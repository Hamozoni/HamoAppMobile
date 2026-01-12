import React from "react";
import { ScrollView } from "react-native";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import TitleForwardIconBtn from "../../../components/buttons/titleForwardIconBtn";
import ThemedViewContainer from "../../../components/themedViews/ThemedViewContainer";
import Seprater from "../../../components/ui/separator";

interface AccountItem {
    id: number;
    title: string;
    link: string;
}

const accountLists: AccountItem[] = [
    {
        id: 1,
        title: "Security notifications",
        link: "./securityNotifications"
    },
    {
        id: 2,
        title: "Two-step verification",
        link: "./twoStepVerification"
    },
    {
        id: 3,
        title: "Email address",
        link: "./email"
    },
    {
        id: 4,
        title: "Passkeys",
        link: "./passkeys"
    },
    {
        id: 5,
        title: "Change phone number",
        link: "./changePhone"
    }
];

const settingsLists: AccountItem[] = [
    {
        id: 1,
        title: "Request account info",
        link: "./requestAccountInfo"
    },
    {
        id: 2,
        title: "Delete my account",
        link: "./deleteMyAccount"
    },
];

export default function SettingsAccount() {
    return (
        <ThemedSafeAreaView>
            <ScrollView>
                <ThemedViewContainer>
                    {
                        accountLists.map((item, index, array) => (
                            <TitleForwardIconBtn
                                key={item.id}
                                title={item.title}
                                link={item.link}
                                isLast={index === array.length - 1}
                            />
                        ))
                    }
                </ThemedViewContainer>
                <Seprater />
                <ThemedViewContainer>
                    {
                        settingsLists.map((item, index, array) => (
                            <TitleForwardIconBtn
                                key={item.id}
                                title={item.title}
                                link={item.link}
                                isLast={index === array.length - 1}
                            />
                        ))
                    }
                </ThemedViewContainer>
            </ScrollView>
        </ThemedSafeAreaView>
    );
}
