import { ScrollView, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SettingsNotifications() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <Text>Notifications</Text>
                </ScrollView>
            </SafeAreaView>

        </SafeAreaProvider>
    );
}