import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import ThemedSafeAreaView from "../../../../components/themedViews/safeAreaView"
import { useLocalSearchParams } from "expo-router/build/hooks"
import { useContactsStore } from "../../../../hooks/store/useContactsStore";
import Ionicons from '@expo/vector-icons/Ionicons';
import ThemedViewContainer from "../../../../components/themedViews/ThemedViewContainer";
import TitleForwardIconBtn from "../../../../components/buttons/titleForwardIconBtn";
import Separator from "../../../../components/ui/separator";


// export default function TitleForwardIconBtn({
//     iconName = null,
//     title,
//     link,
//     isLast = false,
//     selected = null,
// }: TitleForwardIconBtnProps) {

const profileSetting = [
    [{
        id: 1,
        iconName: 'image-outline',
        title: 'Media, links, and docs',
        link: "/chat/profile/media",
        selected: 'None',
    },
    {
        id: 2,
        iconName: 'star-outline',
        title: 'Stared',
        link: "/chat/profile/stared",
        selected: 'None',
    },],
    [
        {
            id: 3,
            iconName: 'notifications-outline',
            title: 'Notifications',
            link: "/chat/profile/notifications",
            selected: null,
        },
        {
            id: 4,
            iconName: 'sunny-outline',
            title: 'Chat theme',
            link: "/chat/profile/theme",
            selected: null,
        },
        {
            id: 5,
            iconName: 'cloud-download-outline',
            title: 'Save to photos',
            link: "/chat/profile/save",
            selected: "Default",
        },
    ],
    [
        {
            id: 7,
            iconName: 'lock-closed-outline',
            title: 'Lock chat',
            link: "/chat/profile/lock",
            selected: "Off",
        },
        {
            id: 6,
            iconName: 'timer-outline',
            title: 'Disapperaring messages',
            link: "/chat/profile/disappearing",
            selected: "Off",
        },
        {
            id: 8,
            iconName: 'lock-closed-outline',
            title: 'Encryption',
            link: "/chat/profile/encryption",
            selected: "Messaged snd calls are end to end encrypted. Tap to verify.",
        },
    ]


]

export default function Profile() {

    const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
    const { registered } = useContactsStore();

    const findContact = () => {
        return registered?.find(e => e.phoneNumber === phoneNumber)
    };

    return (
        <ThemedSafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                <View>
                    {
                        profileSetting.map((e, i) => (
                            <>
                                <ThemedViewContainer key={i}>
                                    {
                                        e.map((item) => (
                                            <TitleForwardIconBtn
                                                key={item.id}
                                                iconName={item.iconName}
                                                title={item.title}
                                                link={item.link}
                                                isLast={item.isLast}
                                                selected={item.selected}
                                            />
                                        ))
                                    }
                                </ThemedViewContainer>
                                <Separator />
                            </>
                        ))
                    }
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
