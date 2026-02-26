import React from "react";
import { StatusPanel } from "../../../components/status/statusPanel";
import ContactsList from "../../../components/contacts/contacts";
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView";

const Updates = () => {
    return (
        <ThemedSafeAreaView>
            <ContactsList>
                <StatusPanel />
            </ContactsList>

        </ThemedSafeAreaView>
    );
};

export default Updates;
