import { Image, ScrollView, Text, View } from "react-native"
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView"
import { useLocalSearchParams } from "expo-router/build/hooks"
import { useContactsStore } from "../../../hooks/store/useContactsStore";


export default function Profile() {

    const { phone } = useLocalSearchParams();

    const { registered } = useContactsStore();

    const findContact = () => {
        return registered?.find(e => e.phoneNumber === phone)
    };



    return (
        <ThemedSafeAreaView>
            <ScrollView >
                <View style={{ justifyContent: "center", alignItems: 'center', paddingHorizontal: 20 }}>
                    <Image source={{ uri: findContact()?.profilePicture }} width={100} height={100} style={{ borderRadius: "50%" }} />
                </View>
                <Text>
                    Profile :{phone}
                </Text>
            </ScrollView>
        </ThemedSafeAreaView>
    )
};


