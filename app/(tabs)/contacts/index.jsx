import { ScrollView, Text, View } from "react-native";
import { StatusPanel } from "../../../components/status/statusPanel";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ContactsList from "../../../components/contacts/contacts";

const Updates = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
                <ScrollView style={{ flex: 1 }}>
                    <StatusPanel />
                    <Text style={{ fontSize: 20, fontWeight: "bold", margin: 20 }}>Contacts</Text>
                    <ContactsList />
                </ScrollView>
            </SafeAreaView>

        </SafeAreaProvider>
    );
};

export default Updates;
