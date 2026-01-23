import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";
import { useAuthStore } from "../store/useAuthStore";

export default function Home() {
    const { hydrate, hydrated, user } = useAuthStore();

    useEffect(() => {
        hydrate();
    }, []);

    if (!hydrated) {
        // VERY short splash, not blank
        return <ActivityIndicator />;
    }

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    return <Redirect href="/(tabs)/chat" />;
}
