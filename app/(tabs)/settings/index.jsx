import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ProfileInfo } from "../../../components/settings/profileInfo";
import { SettingsCard } from "../../../components/cards/settingsCard";
import { SafeAreaView } from "react-native-safe-area-context";

const settingsData1 = [
    { title: "Lists", iconName: "albums-outline", id: 1 },
    { title: "Broadcasts messages", iconName: "megaphone-outline", id: 2 },
    { title: "Starred", iconName: "star-outline", id: 3 },
    { title: "Linked devices", iconName: "laptop-outline", id: 4 },

];
const settingsData2 = [
    { title: "Account", iconName: "person-outline", id: 5 },
    { title: "Privacy", iconName: "lock-closed-outline", id: 6 },
    { title: "Chats", iconName: "chatbubbles-outline", id: 7 },
    { title: "Notifications", iconName: "notifications-outline", id: 8 },
    { title: "Storage and data", iconName: "file-tray-stacked-outline", id: 9 },
];

const settingsData3 = [
    { title: "Help and feedback", iconName: "help-circle-outline", id: 10 },
    { title: "Invite a friend", iconName: "person-add-outline", id: 11 },
];

const Settings = () => {
    return (
        <SafeAreaView edges={["top"]}>
            <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 10 }}>
                <View style={{ flex: 1 }}>
                    <ProfileInfo />

                    <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 20 }}>
                        {settingsData1.map((item) => (
                            <SettingsCard key={item.id} iconName={item.iconName} title={item.title} />
                        ))}
                    </View>
                    <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 20, marginVertical: 20 }}>
                        {settingsData2.map((item) => (
                            <SettingsCard key={item.id} iconName={item.iconName} title={item.title} />
                        ))}
                    </View>
                    <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 20, marginBottom: 20 }}>
                        {settingsData3.map((item) => (
                            <SettingsCard key={item.id} iconName={item.iconName} title={item.title} />
                        ))}
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Settings;
