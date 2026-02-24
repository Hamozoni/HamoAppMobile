import React from "react";
import { ScrollView, Text } from "react-native";
import { StatusPanel } from "../../../components/status/statusPanel";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ContactsList from "../../../components/contacts/contacts";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";
import ContactsPage from "../../(screens)/chats/contacts";

const Updates = () => {
    return (
        <ContactsList>
            <StatusPanel />
        </ContactsList>
    );
};

export default Updates;
