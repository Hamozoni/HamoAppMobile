import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import StatusGalleryCard from "../../../components/cards/statusGalleryCard";
import { STATUSES } from "../../../constants/status";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const StatusGallery = () => {
    const { index } = useLocalSearchParams<{ index: string }>();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <StatusGalleryCard
                    status={STATUSES[Number.parseInt(index || '0')]}
                />
            </View>
        </SafeAreaView>
    );
};

export default StatusGallery;
