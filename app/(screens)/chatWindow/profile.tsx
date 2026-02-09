import { ScrollView, Text } from "react-native"
import ThemedSafeAreaView from "../../../components/themedViews/safeAreaView"
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks"


export default function Profile() {

    const { phone } = useLocalSearchParams();

    return (
        <ThemedSafeAreaView>
            <ScrollView >
                <Text>
                    Profile :{phone}
                </Text>
            </ScrollView>
        </ThemedSafeAreaView>
    )
};


