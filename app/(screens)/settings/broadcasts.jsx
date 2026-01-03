import { ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SettingsBroadcasts() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <Text>Settings Broadcasts</Text>
                </ScrollView>
            </SafeAreaView>

        </SafeAreaProvider>
    );
}