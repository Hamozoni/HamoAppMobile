import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import ThemedSafeAreaView from "../../../../components/themedViews/safeAreaView"
import { useLocalSearchParams } from "expo-router/build/hooks"
import { useContactsStore } from "../../../../hooks/store/useContactsStore";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Profile() {

    const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
    const { registered } = useContactsStore();

    const findContact = () => {
        return registered?.find(e => e.phoneNumber === phoneNumber)
    };

    return (
        <ThemedSafeAreaView>
            <ScrollView >
                <View style={{ justifyContent: "center", alignItems: 'center', paddingTop: 40, marginBottom: 20 }}>
                    <Image source={{ uri: findContact()?.profilePicture }} width={150} height={150} style={{ borderRadius: "50%" }} />
                </View>
                <View style={{ flexDirection: "column", justifyContent: "center", alignContent: "center" }}>
                    <Text style={{ fontSize: 22, fontWeight: 900, textAlign: 'center' }}>
                        {findContact()?.displayName}
                    </Text>
                    <Text style={{ fontSize: 18, textAlign: 'center', color: "gray", marginTop: 3, marginBottom: 5 }}>
                        {findContact()?.phoneNumber}
                    </Text>
                    {
                        findContact()?.about &&
                        <Text style={{ fontSize: 16, textAlign: 'center', color: "gray" }}>
                            {findContact()?.about}
                        </Text>
                    }
                </View>
                <View style={{ flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center", marginVertical: 15 }}>
                    <TouchableOpacity style={styles.infoBtn}>
                        <Ionicons name="call-outline" size={24} color="#65a52aff" />
                        <Text style={{ paddingTop: 5 }}>
                            Audio
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.infoBtn}>
                        <Ionicons name="videocam-outline" size={24} color="#65a52aff" />
                        <Text style={{ paddingTop: 5 }}>
                            Video
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.infoBtn}>
                        <Ionicons name="search" size={24} color="#65a52aff" />
                        <Text style={{ paddingTop: 5 }}>
                            Search
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ThemedSafeAreaView>
    )
};

const styles = StyleSheet.create({
    infoBtn: {
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eee",
        padding: 10,
        borderRadius: 8
    }
})
