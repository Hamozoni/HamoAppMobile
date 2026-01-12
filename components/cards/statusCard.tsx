import { Text, View, ImageBackground, StyleSheet, TouchableOpacity, ImageSourcePropType } from "react-native";
import DynamicSegmentsImage from "./contactImageCard";
import { useRouter } from "expo-router";
import React from "react";

interface StatusItem {
    type: 'text' | 'image' | 'video';
    photoURL?: ImageSourcePropType;
    thumbnail?: ImageSourcePropType;
    bgColor?: string;
    textColor?: string;
    text?: string;
}

interface StatusData {
    name: string;
    photoURL: ImageSourcePropType;
    statuses: StatusItem[];
}

interface StatusCardProps {
    status: StatusData;
    index: number;
}

interface MediaCardProps {
    children: React.ReactNode;
}

interface TextCardProps {
    children: React.ReactNode;
}

export const StatusCard = ({ status, index }: StatusCardProps) => {

    const router = useRouter();

    const MediaCard = ({ children }: MediaCardProps) => {
        const source = status.statuses[0].type === 'image'
            ? status.statuses[0]?.photoURL
            : status.statuses[0]?.thumbnail;
        return (
            <ImageBackground
                source={source}
                resizeMode="cover"
                style={styles.container}
            >{children}
            </ImageBackground>
        );
    };


    const TextCard = ({ children }: TextCardProps) => {
        return (
            <View style={[styles.container, { backgroundColor: status.statuses[0]?.bgColor }]}>
                <View style={{ padding: 10, position: "absolute", bottom: 0, left: 0, top: 0, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                    <Text
                        style={{ fontSize: 10, fontWeight: "bold", color: status.statuses[0]?.textColor, textAlign: "center", width: "100%" }}>{status.statuses[0]?.text}</Text>
                </View>
                {children}
            </View>
        );
    };

    const CardContainer = () => {
        return (
            <>
                <View style={{ borderRadius: 50, zIndex: 0, alignSelf: "flex-start" }}>
                    <DynamicSegmentsImage
                        imageUrl={status.photoURL}
                        size={40}
                        borderWidth={2}
                        totalStatus={status.statuses.length}
                        activeStatus={status.statuses.length}
                        activeColor='#4ef16a'
                        gapAngle={15}
                    />
                </View >
                <Text style={{ fontSize: 10, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 5 }}>{status.name}</Text>
            </>
        );
    };
    if (status.statuses[0]?.type === 'text') {
        return (
            <TouchableOpacity onPress={() => router.push(`/status/${index}` as any)}>
                <TextCard>
                    <CardContainer />
                </TextCard>
            </TouchableOpacity>
        )
    }
    return (
        <TouchableOpacity onPress={() => router.push(`/status/${index}` as any)}>
            <MediaCard>
                <CardContainer />
            </MediaCard>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 180,
        padding: 5,
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        overflow: "hidden",
    }
});
