import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text } from "react-native";

export default function SettingsChats() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <Text>Chats</Text>
                </ScrollView>
            </SafeAreaView>

        </SafeAreaProvider>
    );
}