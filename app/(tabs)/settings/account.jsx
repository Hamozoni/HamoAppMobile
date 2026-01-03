import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text } from "react-native";

export default function SettingsAcount() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <Text>Acount</Text>
                </ScrollView>
            </SafeAreaView>

        </SafeAreaProvider>
    );
}