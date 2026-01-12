import React from "react";
import ContactsList from "../../../components/contacts/contacts";
import ThemedViewContainer from "../../../components/themedViews/ThemedViewContainer";
import TitleForwardIconBtn from "../../../components/buttons/titleForwardIconBtn";
import Separator from "../../../components/ui/separator";
import { Ionicons } from "@expo/vector-icons";

interface ContactButton {
    Title: string;
    iconName: keyof typeof Ionicons.glyphMap;
    id: number;
    link: string;
    selected?: string;
}

const bottons: ContactButton[] = [
    {
        Title: 'New Group',
        iconName: 'people-outline',
        id: 1,
        link: '/chat/newGroup'
    },
    {
        Title: 'New Contact',
        iconName: 'person-add-outline',
        id: 2,
        link: '/chat/newContact'
    },
    {
        Title: 'New Community',
        iconName: 'people-outline',
        id: 3,
        link: '/chat/newCommunity',
        selected: "Bring together topic-based groups"
    },
    {
        Title: 'New broadcast',
        iconName: 'megaphone-outline',
        id: 4,
        link: '/chat/newBroadcast'
    }
];

export default function ContactsPage() {
    return (
        <ContactsList>
            <ThemedViewContainer>
                {
                    bottons.map(({ Title, iconName, id, link, selected }, index) => (
                        <TitleForwardIconBtn
                            key={id}
                            title={Title}
                            iconName={iconName}
                            link={link}
                            selected={selected}
                            isLast={index === bottons.length - 1}
                        />
                    ))
                }
            </ThemedViewContainer>
            <Separator />
        </ContactsList>
    )
}
