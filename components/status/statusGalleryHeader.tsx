import { Dimensions, Text, View, Image, TouchableOpacity, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import React from "react";

const { width } = Dimensions.get("window");

import { Status } from "../../types/components.types";

interface StatusGalleryHeaderProps {
    status: Status;
    statusIndex: number;
    handleNext: () => void;
    durationInSec?: number;
    isTimerRunning: boolean;
}

const StatusGalleryHeader = ({
    status,
    statusIndex,
    handleNext,
    durationInSec = 10,
    isTimerRunning
}: StatusGalleryHeaderProps) => {

    const { index } = useLocalSearchParams<{ index: string }>();
    const router = useRouter();

    const [time, setTime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime >= durationInSec && statusIndex < status?.statuses?.length) {
                    handleNext();
                    return 0;
                }
                if (prevTime < durationInSec) {
                    if (isTimerRunning === true) {
                        return prevTime + 0.1;
                    }
                    return prevTime;
                }
                return 0;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [isTimerRunning, durationInSec, statusIndex, status?.statuses?.length, handleNext]);

    useEffect(() => {
        setTime(0);
    }, [statusIndex, index]);


    return (
        <View style={{ width, paddingHorizontal: 10, zIndex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                {
                    status?.statuses?.map((_, index) => {
                        const sLength = status.statuses.length;
                        return (
                            <View key={index} style={{ flex: 1, width: (width / sLength), height: 6, backgroundColor: "#696767ff", borderRadius: 5 }}>
                                <View
                                    style={{
                                        width: index === statusIndex ? `${(time / durationInSec) * 100}%` : index < statusIndex ? "100%" : "0%",
                                        height: 6,
                                        backgroundColor: "#afafafff",
                                        borderRadius: 5
                                    }}
                                ></View>
                            </View>
                        );
                    })
                }
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons
                        name="chevron-back"
                        size={32} color="black"
                    />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, flex: 1 }}>
                    <Image source={status.photoURL} style={{ width: 40, height: 40, borderRadius: 20 }} />
                    <View>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{status.name}</Text>
                        <Text style={{ fontSize: 12, color: "#8e8e8eff" }}>{status?.statuses[statusIndex]?.createdAt}</Text>
                    </View>
                </View>
                <Ionicons name="ellipsis-vertical" size={28} color="black" />
            </View>
        </View>
    );
};
export default StatusGalleryHeader;
