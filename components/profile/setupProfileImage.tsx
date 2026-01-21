import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { useProfilePictureSignature } from '../../hooks/useProfilePicureSignature';
import axios from 'axios';
import { useUpdateProfile } from '../../hooks/useProfileApi';

export const SetupProfileImage = () => {


    const [profileImage, setProfileImage] = useState<any>(null);

    const { mutateAsync: postProfilePictureSignature, isPending } = useProfilePictureSignature();
    const { mutateAsync: postProfilePicture, isPending: isPendingProfilePicture } = useUpdateProfile();
    const handleContinue = async (image: any) => {
        // if (!validateForm()) return;

        try {
            if (image) {

                const formData = new FormData();
                const pictureSignature = await postProfilePictureSignature();

                console.log(pictureSignature);

                if (!pictureSignature) return;
                formData.append('file', image);
                formData.append('public_id', pictureSignature.publicId);
                formData.append('signature', pictureSignature.signature);
                formData.append('timestamp', pictureSignature.timestamp);
                formData.append('cloud_name', pictureSignature.cloudName);
                formData.append('api_key', pictureSignature.apiKey);
                formData.append('folder', pictureSignature.folder);
                formData.append('overwrite', pictureSignature.overwrite.toString());
                formData.append('invalidate', pictureSignature.invalidate.toString());


                const { data } = await axios.post(pictureSignature.uploadUrl, formData, { headers: { 'Content-Type': 'multipart/form-data' } });


                console.log(data);
                const profileData = await postProfilePicture({ profilePicture: data.secure_url, profilePicturePublicId: data.public_id });
                console.log(profileData);
            }

            // router.replace("/(tabs)/chat" as string);
        } catch (err: any) {
            console.log("Cloudinary Error:", JSON.stringify(err.response.data, null, 2));
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to upload a profile picture.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0]);
            handleContinue(result.assets[0]);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
            alert("Sorry, we need camera permissions to take a profile picture.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0]);
            handleContinue(result.assets[0]);
        }
    };

    return (
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, borderStyle: 'dashed' }}>

            <ImageBackground source={require('../../assets/images/sudaChat.jpg')} style={styles.imageSection}>
                <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={pickImage}
                >
                    {profileImage ? (
                        <Image
                            source={{ uri: profileImage.uri }}
                            style={styles.profileImage}
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="person" size={60} color="#ccc" />
                        </View>
                    )}
                    <View style={styles.editBadge}>
                        <Ionicons name="camera" size={18} color="#fff" />
                    </View>
                </TouchableOpacity>

                <View style={styles.imageButtons}>
                    <TouchableOpacity
                        style={styles.imageOptionButton}
                        onPress={pickImage}
                    >
                        <Ionicons name="images-outline" size={20} color="#259cd3" />
                        <Text style={styles.imageOptionText}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.imageOptionButton}
                        onPress={takePhoto}
                    >
                        <Ionicons name="camera-outline" size={20} color="#259cd3" />
                        <Text style={styles.imageOptionText}>Camera</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>

        </View>
    );
};

const styles = StyleSheet.create({
    imageSection: {
        alignItems: "center",
        padding: 20,
        objectFit: 'cover',
    },
    imageContainer: {
        position: "relative",
        marginBottom: 20,
    },
    profileImage: {
        borderRadius: "50%",
        backgroundColor: "#fff",
        width: 130,
        height: 130,
        borderWidth: 2,
        borderColor: "#73bae9ff",
        borderStyle: "dashed",
    },
    imagePlaceholder: {
        width: 130,
        height: 130,
        borderRadius: "50%",
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#eee",
        borderStyle: "dashed",
    },
    editBadge: {
        position: "absolute",
        bottom: 5,
        right: 5,
        width: 38,
        height: 38,
        borderRadius: "50%",
        backgroundColor: "#259cd3",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#fff",
    },
    imageButtons: {
        flexDirection: "row",
        gap: 15,
    },
    imageOptionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#a9c7ffff",
        borderStyle: "dashed",
        backgroundColor: "#e8f4f8",
    },
    imageOptionText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#259cd3",
    }
});