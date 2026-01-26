import React from "react";
import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import ThemedSafeAreaView from "../../../../components/themedViews/safeAreaView";
import Separator from "../../../../components/ui/separator";
import ThemedViewContainer from "../../../../components/themedViews/ThemedViewContainer";
import TitleForwardIconBtn from "../../../../components/buttons/titleForwardIconBtn";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../../../hooks/store/useAuthStore";

type IoniconsName = keyof typeof Ionicons.glyphMap;


interface ProfileItem {
    _id: string | undefined;
    subTitle: string;
    title: string | undefined;
    link: string | undefined;
    iconName: IoniconsName;
}

export default function Profile() {

    const user = useAuthStore((state) => state.user);

    const profileData: ProfileItem[] = [
        { subTitle: "Name", title: user?.displayName, _id: "name", link: '/settings/profile/name', iconName: 'person-outline' },
        { subTitle: "About", title: user?.about, _id: "about", link: '/settings/profile/about', iconName: 'alert-circle-outline' },
        { subTitle: "Phone", title: user?.phoneNumber, _id: "phone", link: '/settings/profile/phone', iconName: 'call-outline' },
    ];
    return (
        <ThemedSafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View style={{ alignItems: "center", marginVertical: 20 }}>
                    <TouchableOpacity style={{ alignItems: "center", marginBottom: 10 }}>
                        <Image
                            source={{ uri: user?.profilePictureFileId?.secureUrl }}
                            style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: "#e4f7c2ff" }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 18, fontWeight: "700", color: "#095e06ff" }}>Change Profile Photo</Text>
                    </TouchableOpacity>
                </View>
                <Separator />
                {profileData.map(({ subTitle, title, _id, link, iconName }) => (
                    <View key={_id}>
                        <Text style={{ fontSize: 16, color: "#606160ff", fontWeight: '600', marginBottom: 10, paddingHorizontal: 15 }}>{subTitle}</Text>
                        <ThemedViewContainer>
                            <TitleForwardIconBtn
                                title={title}
                                iconName={iconName}
                                link={link}
                                selected={null}
                                isLast={true}
                            />
                        </ThemedViewContainer>
                        <Separator />
                    </View>
                ))}
            </ScrollView>
        </ThemedSafeAreaView>
    );
};
