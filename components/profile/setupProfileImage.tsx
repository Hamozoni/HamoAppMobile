import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface SetupProfileImageProps {
    imageUri: string | null;
    onImageSelected: (asset: ImagePicker.ImagePickerAsset) => void;
    isUploading?: boolean;
}

export const SetupProfileImage: React.FC<SetupProfileImageProps> = ({
    imageUri,
    onImageSelected,
    isUploading = false,
}) => {

    const requestAndPick = async (
        launcher: () => Promise<ImagePicker.ImagePickerResult>,
        permissionRequester: () => Promise<ImagePicker.PermissionResponse>,
        permissionName: string
    ) => {
        const { status } = await permissionRequester();
        if (status !== ImagePicker.PermissionStatus.GRANTED) {
            Alert.alert('Permission Required', `Please grant ${permissionName} access to continue.`);
            return;
        }

        const result = await launcher();
        if (!result.canceled && result.assets[0]) {
            onImageSelected(result.assets[0]);
        }
    };

    const pickImage = () =>
        requestAndPick(
            () =>
                ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                }),
            ImagePicker.requestMediaLibraryPermissionsAsync,
            'photo library'
        );

    const takePhoto = () =>
        requestAndPick(
            () =>
                ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                }),
            ImagePicker.requestCameraPermissionsAsync,
            'camera'
        );

    return (
        <View style={styles.container}>
            <View
                style={styles.imageSection}
            >
                <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={pickImage}
                    disabled={isUploading}
                    activeOpacity={0.8}
                >
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="person" size={60} color="#ccc" />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.imageButtons}>
                    <TouchableOpacity
                        style={styles.imageOptionButton}
                        onPress={pickImage}
                        disabled={isUploading}
                    >
                        <Ionicons name="images-outline" size={20} color="#888" />
                        <Text style={styles.imageOptionText}>Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.imageOptionButton}
                        onPress={takePhoto}
                        disabled={isUploading}
                    >
                        <Ionicons name="camera-outline" size={20} color="#888" />
                        <Text style={styles.imageOptionText}>Camera</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        borderRadius: 12,
        overflow: 'hidden',
    },
    imageSection: {
        alignItems: 'center',
        paddingVertical: 24,

    },
    imageContainer: {
        position: 'relative',
        width: 180,
        height: 180,
        borderRadius: "50%",
    },
    profileImage: {
        width: 180,
        height: 180,
        borderRadius: "50%",
    },
    imagePlaceholder: {
        width: 180,
        height: 180,
        borderRadius: "50%",
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageButtons: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 10
    },
    imageOptionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#c6ddf0ff',
        gap: 6,
    },
    imageOptionText: {
        color: '#888',
        fontWeight: '600',
    },
});