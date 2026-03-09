import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, FontAwesome6, Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

interface FooterAttachmentProps {
    keyboardHeight: number;
    setIsAttachment: (value: boolean) => void;
}

interface AttachmentItem {
    id: number;
    label: string;
    color: string;
    bgColor: string;
    icon: React.ReactNode;
    onPress: () => void;
}

export default function FooterAttachment(
    {
        keyboardHeight,
        setIsAttachment
    }: FooterAttachmentProps) {

    const router = useRouter();

    const pickImage = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!granted) {
            Alert.alert("Permission required", "Please grant media library access.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            allowsMultipleSelection: true,
            quality: 1,
        });
        if (!result.canceled) {
            // handle result.assets
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
            if (!result.canceled) {
                // handle result.assets[0]
            }
        } catch (e) {
            console.error("Document pick error:", e);
        }
    };

    const items: AttachmentItem[] = [
        {
            id: 1, label: "Photo & Video",
            color: "#0EA5E9", bgColor: "#E0F2FE",
            icon: <FontAwesome6 name="photo-film" size={24} color="#0EA5E9" />,
            onPress: pickImage,
        },
        {
            id: 2, label: "Camera",
            color: "#111B21", bgColor: "#F3F4F6",
            icon: <Ionicons name="camera" size={26} color="#111B21" />,
            onPress: () => router.push("/chats/camera" as any),
        },
        {
            id: 3, label: "Location",
            color: "#25D366", bgColor: "#D1FAE5",
            icon: <FontAwesome6 name="location-dot" size={24} color="#25D366" />,
            onPress: () => router.push("/chats/location" as any),
        },
        {
            id: 4, label: "Contact",
            color: "#8B5CF6", bgColor: "#EDE9FE",
            icon: <FontAwesome6 name="contact-book" size={24} color="#8B5CF6" />,
            onPress: () => router.push("/chats/shareContacts" as any),
        },
        {
            id: 5, label: "Document",
            color: "#0EA5E9", bgColor: "#E0F2FE",
            icon: <Ionicons name="document-text" size={26} color="#0EA5E9" />,
            onPress: pickDocument,
        },
        {
            id: 6, label: "Close",
            color: "#667781", bgColor: "#F3F4F6",
            icon: <Ionicons name="chevron-down" size={26} color="#667781" />,
            onPress: () => setIsAttachment(false),
        },
    ];

    return (
        <View style={[styles.container, { height: keyboardHeight - 13 }]}>
            <View style={styles.grid}>
                {items.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={item.onPress}
                        style={styles.item}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.circle, { backgroundColor: item.bgColor }]}>
                            {item.icon}
                        </View>
                        <Text style={styles.label}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "#F0F2F5",
        paddingTop: 16,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        rowGap: 20,
    },
    item: {
        width: "30%",
        alignItems: "center",
        gap: 8,
    },
    circle: {
        width: 58,
        height: 58,
        borderRadius: 29,
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        color: "#111B21",
        textAlign: "center",
    },
});
