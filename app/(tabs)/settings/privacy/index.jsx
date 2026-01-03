import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text } from "react-native";

export default function SettingsPrivacy() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <Text>Privacy</Text>
                </ScrollView>
            </SafeAreaView>

        </SafeAreaProvider>
    );
}