import { ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SettingsLists() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <Text>Settings Lists</Text>
                </ScrollView>
            </SafeAreaView>

        </SafeAreaProvider>
    );
}