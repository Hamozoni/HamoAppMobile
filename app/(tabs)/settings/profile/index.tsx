import React from "react";
import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import ThemedSafeAreaView from "../../../../components/themedViews/safeAreaView";
import Separator from "../../../../components/ui/separator";
import ThemedViewContainer from "../../../../components/themedViews/ThemedViewContainer";
import TitleForwardIconBtn from "../../../../components/buttons/titleForwardIconBtn";
import { Ionicons } from "@expo/vector-icons";

type IoniconsName = keyof typeof Ionicons.glyphMap;

const profileImage = require("../../../../assets/images/pexels-al-amin-muhammad-988616478-29680723.jpg");

interface ProfileItem {
    id: number;
    subTitle: string;
    title: string;
    link: string;
    iconName: IoniconsName;
}

const profileData: ProfileItem[] = [
    { subTitle: "Name", title: "John Doe", id: 1, link: '/settings/profile/name', iconName: 'person-outline' },
    { subTitle: "About", title: "at work", id: 2, link: '/settings/profile/about', iconName: 'alert-circle-outline' },
    { subTitle: "Phone", title: "+1234567890", id: 3, link: '/settings/profile/phone', iconName: 'call-outline' },
];

export default function Profile() {
    return (
        <ThemedSafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View style={{ alignItems: "center", marginVertical: 20 }}>
                    <TouchableOpacity style={{ alignItems: "center", marginBottom: 10 }}>
                        <Image
                            source={profileImage}
                            style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: "#e4f7c2ff" }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 18, fontWeight: "700", color: "#095e06ff" }}>Change Profile Photo</Text>
                    </TouchableOpacity>
                </View>
                <Separator />
                {profileData.map(({ subTitle, title, id, link, iconName }) => (
                    <View key={id}>
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
