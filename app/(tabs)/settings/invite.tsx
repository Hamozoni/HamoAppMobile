import React from "react";
import ContactsList from "../../../components/contacts/contacts";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";

export default function SettingsInvite() {
    return (
        <ThemedSafeAreaView edges={["top"]}>
            <ContactsList />

        </ThemedSafeAreaView>
    );
}
