// import React, { useEffect, useState } from 'react'
// import { View, Text, Image, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native'
// import { Ionicons } from '@expo/vector-icons'
// import * as ImagePicker from 'expo-image-picker';
// import { useProfilePictureSignature } from '../../hooks/api/useProfilePicureSignature';
// import axios from 'axios';
// import { useUpdateProfilePicture } from '../../hooks/api/useProfileApi';
// import { useAuthStore } from '../../hooks/store/useAuthStore';

// export const SetupProfileImage = ({ setIsProfileEdit }: { setIsProfileEdit: React.Dispatch<React.SetStateAction<boolean>> }) => {

//     const user = useAuthStore(state => state.user);
//     const [profileImage, setProfileImage] = useState<any>(user?.profilePicture || null);

//     const { mutateAsync: postProfilePictureSignature, isPending } = useProfilePictureSignature();
//     const { mutateAsync: postProfilePicture, isPending: isPendingProfilePicture } = useUpdateProfilePicture();

//     useEffect(() => {
//         setIsProfileEdit(profileImage === user?.profilePicture);
//     }, [profileImage]);

//     const handleContinue = async (image: any) => {
//         // if (!validateForm()) return;

//         try {
//             if (image) {


//                 const formData = new FormData() as any;
//                 const pictureSignature = await postProfilePictureSignature();

//                 if (!pictureSignature) return;

//                 // Use the Expo asset directly - no File conversion needed
//                 formData.append('file', {
//                     uri: image.uri,
//                     type: image.mimeType,
//                     name: image.fileName || 'avatar.jpg'
//                 })

//                 formData.append('public_id', pictureSignature.publicId);
//                 formData.append('signature', pictureSignature.signature);
//                 formData.append('timestamp', pictureSignature.timestamp);
//                 formData.append('api_key', pictureSignature.apiKey);
//                 formData.append('folder', pictureSignature.folder);
//                 formData.append('cloud_name', pictureSignature.cloudName);
//                 formData.append('overwrite', pictureSignature.overwrite.toString());
//                 formData.append('invalidate', pictureSignature.invalidate.toString());


//                 const { data } = await axios.post(pictureSignature.uploadUrl, formData);

//                 console.log(data);

//                 const profileData = await postProfilePicture(data);

//                 console.log(profileData);
//             }

//             // router.replace("/(tabs)/chat" as string);
//         } catch (err: any) {
//         }
//     };

//     const pickImage = async () => {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

//         if (status !== "granted") {
//             alert("Sorry, we need camera roll permissions to upload a profile picture.");
//             return;
//         }

//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ['images'],
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 0.8,
//         });

//         if (!result.canceled) {
//             setProfileImage(result?.assets[0]?.uri);
//             handleContinue(result?.assets[0]);
//         }
//     };

//     const takePhoto = async () => {
//         const { status } = await ImagePicker.requestCameraPermissionsAsync();

//         if (status !== "granted") {
//             alert("Sorry, we need camera permissions to take a profile picture.");
//             return;
//         }

//         const result = await ImagePicker.launchCameraAsync({
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 0.8,
//         });

//         if (!result.canceled) {
//             setProfileImage(result.assets[0]?.uri);
//             handleContinue(result.assets[0]);
//         }
//     };

//     return (
//         <View style={{ borderWidth: 1, borderColor: '#ccc', borderStyle: 'dashed' }}>

//             <ImageBackground source={require('../../assets/images/sudaChat.jpg')} style={styles.imageSection}>
//                 <TouchableOpacity
//                     style={styles.imageContainer}
//                     onPress={pickImage}
//                 >
//                     {profileImage ? (
//                         <Image
//                             source={{ uri: profileImage }}
//                             style={styles.profileImage}
//                         />
//                     ) : (
//                         <View style={styles.imagePlaceholder}>
//                             <Ionicons name="person" size={60} color="#ccc" />
//                         </View>
//                     )}
//                     <View style={styles.editBadge}>
//                         <Ionicons name="camera" size={18} color="#fff" />
//                     </View>
//                 </TouchableOpacity>

//                 <View style={styles.imageButtons}>
//                     <TouchableOpacity
//                         style={styles.imageOptionButton}
//                         onPress={pickImage}
//                     >
//                         <Ionicons name="images-outline" size={20} color="#259cd3" />
//                         <Text style={styles.imageOptionText}>Gallery</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={styles.imageOptionButton}
//                         onPress={takePhoto}
//                     >
//                         <Ionicons name="camera-outline" size={20} color="#259cd3" />
//                         <Text style={styles.imageOptionText}>Camera</Text>
//                     </TouchableOpacity>
//                 </View>
//             </ImageBackground>

//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     imageSection: {
//         alignItems: "center",
//         padding: 20,
//         objectFit: 'cover',
//     },
//     imageContainer: {
//         position: "relative",
//         marginBottom: 20,
//     },
//     profileImage: {
//         borderRadius: "50%",
//         backgroundColor: "#fff",
//         width: 130,
//         height: 130,
//         borderWidth: 2,
//         borderColor: "#73bae9ff",
//         borderStyle: "dashed",
//     },
//     imagePlaceholder: {
//         width: 130,
//         height: 130,
//         borderRadius: "50%",
//         backgroundColor: "#fff",
//         justifyContent: "center",
//         alignItems: "center",
//         borderWidth: 2,
//         borderColor: "#eee",
//         borderStyle: "dashed",
//     },
//     editBadge: {
//         position: "absolute",
//         bottom: 5,
//         right: 5,
//         width: 38,
//         height: 38,
//         borderRadius: 28,
//         backgroundColor: "#259cd3",
//         justifyContent: "center",
//         alignItems: "center",
//         borderWidth: 3,
//         borderColor: "#fff",
//     },
//     imageButtons: {
//         flexDirection: "row",
//         gap: 15,
//     },
//     imageOptionButton: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 5,
//         flex: 1,
//         paddingVertical: 8,
//         paddingHorizontal: 16,
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: "#a9c7ffff",
//         borderStyle: "dashed",
//         backgroundColor: "#e8f4f8",
//     },
//     imageOptionText: {
//         fontSize: 14,
//         fontWeight: "600",
//         color: "#259cd3",
//     }
// });

import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, StyleSheet, Alert } from 'react-native';
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
            <ImageBackground
                source={require('../../assets/images/sudaChat.jpg')}
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
                    <View style={styles.editBadge}>
                        <Ionicons name="camera" size={18} color="#fff" />
                    </View>
                </TouchableOpacity>

                <View style={styles.imageButtons}>
                    <TouchableOpacity
                        style={styles.imageOptionButton}
                        onPress={pickImage}
                        disabled={isUploading}
                    >
                        <Ionicons name="images-outline" size={20} color="#259cd3" />
                        <Text style={styles.imageOptionText}>Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.imageOptionButton}
                        onPress={takePhoto}
                        disabled={isUploading}
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
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#259cd3',
        padding: 8,
        borderRadius: 20,
    },
    imageButtons: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 12,
    },
    imageOptionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#ffffffEE',
        gap: 6,
    },
    imageOptionText: {
        color: '#259cd3',
        fontWeight: '600',
    },
});