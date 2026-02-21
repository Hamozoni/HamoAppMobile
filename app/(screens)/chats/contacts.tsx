import React from "react";
import ContactsList from "../../../components/contacts/contacts";
import TitleForwardIconBtn from "../../../components/buttons/titleForwardIconBtn";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import ThemedViewContainer from "../../../components/themedViews/ThemedViewContainer";

interface ContactButton {
    title: string;
    iconName: keyof typeof Ionicons.glyphMap;
    id: number;
    link: string;
    selected?: string;
}

const BUTTONS: ContactButton[] = [
    {
        title: "New Group",
        iconName: "people-outline",
        id: 1,
        link: "/chat/newGroup",
    },
    {
        title: "New Contact",
        iconName: "person-add-outline",
        id: 2,
        link: "/chat/newContact",
    },
    {
        title: "New Community",
        iconName: "people-circle-outline",
        id: 3,
        link: "/chat/newCommunity",
        selected: "Bring together topic-based groups",
    },
    {
        title: "New Broadcast",
        iconName: "megaphone-outline",
        id: 4,
        link: "/chat/newBroadcast",
    },
];

export default function ContactsPage() {
    return (
        <ContactsList>
            {/* Action buttons group — same rounded card style as contact cards */}
            <ThemedViewContainer>
                {BUTTONS.map(({ title, iconName, id, link, selected }, index) => (
                    <TitleForwardIconBtn
                        key={id}
                        title={title}
                        iconName={iconName}
                        link={link}
                        selected={selected}
                        isLast={index === BUTTONS.length - 1}
                    />
                ))}
            </ThemedViewContainer>
        </ContactsList>
    );
}
