import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import { useContactsStore } from "../../../../hooks/store/useContactsStore";
import ThemedSafeAreaView from "../../../../components/themedViews/safeAreaView";
import ThemedViewContainer from "../../../../components/themedViews/ThemedViewContainer";
import TitleForwardIconBtn from "../../../../components/buttons/titleForwardIconBtn";
import Separator from "../../../../components/ui/separator";
import { useAuthStore } from "../../../../hooks/store/useAuthStore";
import Avatar from "../../../../components/ui/avatar";
import AnimatedBorder from "../../../../components/ui/animatedBorder";
import { useChatsStore } from "../../../../hooks/store/useChatsStore";
import { useLocalSearchParams } from "expo-router";

interface ProfileButton {
    id: any;
    data: {
        id: number;
        iconName: keyof typeof Ionicons.glyphMap; // ✅ not string
        title: string;
        link: string;
        selected?: string | null;
    }[];
}

const profileSetting: ProfileButton[] = [
    {
        id: "first",
        data: [{
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

    },
    {
        id: "sec",
        data:
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
    },
    {
        id: "third",
        data:
            [
                {
                    id: 6,
                    iconName: 'lock-closed-outline',
                    title: 'Lock chat',
                    link: "/chat/profile/lock",
                    selected: "Off",
                },
                {
                    id: 7,
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
    },
]

export default function Profile() {

    const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
    const { registered } = useContactsStore();
    const user = useAuthStore(state => state.user);

    const findContact = () => {
        return registered?.find(e => e.phoneNumber === phoneNumber)
    };

    const chats = useChatsStore((state) => state.chats);

    // 1. Safely find the chat where one of the participants matches the phone number
    const contact = chats?.find((chat) =>
        chat?.participants?.some((participant) => participant?.phoneNumber === phoneNumber)
    )?.participants?.find(e => e.phoneNumber === phoneNumber)

    return (
        <ThemedSafeAreaView edges={["top"]}>
            <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
                <Separator />
                <ThemedViewContainer>
                    <View style={{ justifyContent: "center", alignItems: 'center', paddingTop: 40, marginBottom: 20 }}>
                        <AnimatedBorder>
                            <Avatar
                                profilePicture={contact?.profilePicture?.secureUrl}
                                displayName={findContact()?.displayName || contact?.phoneNumber}
                                width={150} height={150} />
                        </AnimatedBorder>
                    </View>
                    <View style={{ flexDirection: "column", justifyContent: "center", alignContent: "center" }}>
                        <Text style={{ fontSize: 22, fontWeight: 900, textAlign: 'center' }}>
                            {findContact()?.displayName || contact?.displayName}
                            {user?.phoneNumber === contact?.phoneNumber && ' ( You )'}
                        </Text>
                        <Text style={{ fontSize: 18, textAlign: 'center', color: "gray", marginTop: 3, marginBottom: 5 }}>
                            {contact?.phoneNumber}
                        </Text>
                        {
                            (findContact()?.about || contact?.about) &&
                            <Text style={{ fontSize: 16, textAlign: 'center', color: "gray" }}>
                                {findContact()?.about || contact?.about}
                            </Text>
                        }
                    </View>

                    <View style={{ flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center", margin: 15 }}>
                        <TouchableOpacity style={[styles.infoBtn, { backgroundColor: "#cdfdffff", }]}>
                            <Ionicons name="call-outline" size={28} color="#073d30ff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.infoBtn, { backgroundColor: "#fed8ffff", }]}>
                            <Ionicons name="videocam-outline" size={28} color="#8d2084ff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.infoBtn, { backgroundColor: "#f2ffc4ff", }]}>
                            <Ionicons name="search" size={28} color="#5c3b10ff" />
                        </TouchableOpacity>
                    </View>

                </ThemedViewContainer>
                <Separator />
                <View>
                    {
                        profileSetting.map((e) => (
                            <View key={e.id}>
                                <ThemedViewContainer >
                                    {
                                        e.data.map((item, index) => (
                                            <TitleForwardIconBtn
                                                key={item.id}
                                                iconName={item.iconName}
                                                title={item.title}
                                                link={item.link}
                                                isLast={e.data.length - 1 === index}
                                                selected={item.selected}
                                            />
                                        ))
                                    }
                                </ThemedViewContainer>
                                <Separator />
                            </View>
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
        padding: 10,
        borderRadius: 6
    }
})
