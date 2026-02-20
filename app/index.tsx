import { Redirect } from "expo-router";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { ActivityIndicator } from "react-native";

export default function Index() {
    const { user, hydrated } = useAuthStore();


    if (!hydrated) return <ActivityIndicator />;

    if (user) {
        return <Redirect href="/(auth)/login" />;
    }

    return <Redirect href="/(tabs)/chats" />;
}
