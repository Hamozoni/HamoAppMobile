import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons, FontAwesome6, Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function FooterAttachment({ keyboardHeight, setIsAttachment }) {

    const [selectedAssets, setSelectedAssets] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const router = useRouter();

    const pickImage = async () => {
        const states = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!states.granted) {
            Alert.alert("Permission required", "Please grant permission to access your media library");
            return;
        };

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsMultipleSelection: true,
            quality: 1,
        });

        console.log(result);

        if (result.canceled) {
            return
        } else {
            setSelectedAssets(result.assets);
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf', // Allows all file types
            });

            if (!result.canceled) {
                // The selected file's information is in result.assets[0]
                const file = result.assets[0];
                setSelectedDocument(file);
                // You can now use this URI for upload or processing
            } else {
                console.log('User canceled the picker.');
            }
        } catch (error) {
            console.error('Error picking document:', error);
        }
    };

    return (
        <View style={[styles.attachmentContainer, { height: keyboardHeight - 13 }]}>
            <View style={styles.attachmentRow}>
                <View style={styles.attachmentItem}>
                    <TouchableOpacity style={styles.attachmentItemButton} onPress={pickImage}>
                        <FontAwesome6 name="photo-film" size={28} color="#60adecff" />
                    </TouchableOpacity>
                    <Text style={styles.attachmentItemText}>Photo</Text>
                </View>
                <View style={styles.attachmentItem}>
                    <TouchableOpacity style={styles.attachmentItemButton} onPress={() => router.push("/chatWindow/camera")}>
                        <Entypo name="camera" size={28} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.attachmentItemText}>Camera</Text>
                </View>
                <View style={styles.attachmentItem}>
                    <TouchableOpacity style={styles.attachmentItemButton} onPress={() => router.push("/chatWindow/location")}>
                        <FontAwesome6 name="location-dot" size={34} color="#54ce49ee" />
                    </TouchableOpacity>
                    <Text style={styles.attachmentItemText}>Location</Text>
                </View>
            </View>
            <View style={styles.attachmentRow}>
                <View style={styles.attachmentItem}>
                    <TouchableOpacity style={styles.attachmentItemButton} onPress={() => router.push("/chatWindow/shareContacts")}>
                        <FontAwesome6 name="contact-book" size={28} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.attachmentItemText}>Contacts</Text>
                </View>
                <View style={styles.attachmentItem}>
                    <TouchableOpacity style={styles.attachmentItemButton} onPress={pickDocument}>
                        <Ionicons name="document" size={34} color="#60adecff" />
                    </TouchableOpacity>
                    <Text style={styles.attachmentItemText}>Document</Text>
                </View>
                <View style={styles.attachmentItem}>
                    <TouchableOpacity style={styles.attachmentItemButton} onPress={() => setIsAttachment(false)}>
                        <Ionicons name="chevron-down" size={34} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.attachmentItemText}>Back</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    attachmentContainer: {
        backgroundColor: "#fff",
        paddingVertical: 30,

    },
    attachmentRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginVertical: 13,
        gap: 10
    },
    attachmentItem: {
        alignItems: "center",
        justifyContent: "center",
        gap: 7
    },
    attachmentItemButton: {
        width: 55,
        height: 55,
        borderRadius: "50%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ebebebff"
    },
    attachmentItemText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#000000ff"
    }
});