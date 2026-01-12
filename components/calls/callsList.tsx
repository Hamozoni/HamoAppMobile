import React from "react";
import { View } from "react-native";
import { CALLS } from "../../constants/call";
import { CallCard } from "../cards/callCard";

export const CallsList = () => {
    return (
        <View >
            {
                CALLS.map((call) => (
                    <CallCard key={call.id} call={call} />
                ))
            }
        </View>
    );
};
