import { Redirect } from "expo-router";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { runMigrations } from "../db/runMigration";

export default function Index() {
    const { user, hydrated } = useAuthStore();
    const [isReady, setIsready] = useState<Boolean>(false);

    useEffect(() => {
        runMigrations();
        setIsready(true)
    }, [])

    if (!hydrated || !isReady) return <ActivityIndicator />;

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    return <Redirect href="/(tabs)/chat" />;
}
