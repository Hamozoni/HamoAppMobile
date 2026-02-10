import { Image, ScrollView, Text, View } from "react-native"
import ThemedSafeAreaView from "../../../../components/themedViews/safeAreaView"
import { useLocalSearchParams } from "expo-router/build/hooks"
import { useContactsStore } from "../../../../hooks/store/useContactsStore";


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
                    <Text style={{ fontSize: 22, fontWeight: 900, textAlign: 'center', marginBottom: 5 }}>
                        {findContact()?.displayName}
                    </Text>
                    <Text style={{ fontSize: 18, textAlign: 'center', color: "gray" }}>
                        {findContact()?.phoneNumber}
                    </Text>

                </View>
            </ScrollView>
        </ThemedSafeAreaView>
    )
};
