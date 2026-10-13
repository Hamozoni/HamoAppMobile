import { Redirect } from "expo-router";
import { useAuthStore } from "../hooks/store/useAuthStore";
import { ActivityIndicator } from "react-native";

export default function Index() {

    const { user, hydrated } = useAuthStore();

    if (!hydrated) return <ActivityIndicator />;

    if (!user) {
        console.log("No user found!");
        return <Redirect href="/(auth)/login" />;
    }

    console.log(user, "User found!");
    return <Redirect href="/(tabs)/chats" />;

}
