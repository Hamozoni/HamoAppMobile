import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text } from "react-native";

export default function SettingsLinkedDevices() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <Text>Linked Devices</Text>
                </ScrollView>
            </SafeAreaView>

        </SafeAreaProvider>
    );
}