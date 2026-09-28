// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import ThemedSafeAreaView from "../../components/themedViews/safeAreaView";
// import Separator from "../../components/ui/separator";
// import { SetupProfileImage } from "../../components/profile/setupProfileImage";
// import { useUpdateProfile } from "../../hooks/api/useProfileApi";
// import { AuthBootstrap } from "../../utils/authBootstrap";
// import { useAuthStore } from "../../hooks/store/useAuthStore";

// interface Errors {
//     displayName?: string;
//     birthDate?: string;
// };


// export default function SetupProfile() {

//     const router = useRouter();
//     const user = useAuthStore(state => state.user);

//     const [displayName, setDisplayName] = useState(user?.displayName || "");
//     const [about, setAbout] = useState(user?.about || "");
//     const [errors, setErrors] = useState<Errors>({});
//     const [isProfileEdit, setIsProfileEdit] = useState(true);

//     const { mutateAsync: postUpdateProfile, isPending: isLoading } = useUpdateProfile();

//     const handleContinue = async () => {
//         // if (!validateForm()) return;

//         try {

//             const response = await postUpdateProfile({
//                 displayName,
//                 about,
//             });

//             await useAuthStore.getState().setUser(response);

//             router.replace("/(tabs)/chats" as string);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const handleSkip = () => {
//         router.replace("/(tabs)/chats" as string);
//     };

//     const shouldDisabled =
//         displayName === user?.displayName && about === user?.about && isProfileEdit;

//     return (
//         <ThemedSafeAreaView>
//             <AuthBootstrap />
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === "ios" ? "padding" : "height"}
//                 style={styles.container}
//             >
//                 <ScrollView
//                     contentContainerStyle={styles.scrollContent}
//                     showsVerticalScrollIndicator={false}
//                     keyboardShouldPersistTaps="handled"
//                 >
//                     <TouchableOpacity
//                         style={styles.skipButton}
//                         onPress={handleSkip}
//                     >
//                         <Text style={styles.skipButtonText}>Skip</Text>
//                     </TouchableOpacity>
//                     <Separator />
//                     <SetupProfileImage setIsProfileEdit={setIsProfileEdit} />

//                     <Separator />
//                     <View style={{ padding: 20 }}>

//                         <View >
//                             <Separator />
//                             <View >
//                                 <Text style={styles.inputLabel}>Username *</Text>
//                                 <View style={[
//                                     styles.inputContainer,
//                                     errors.displayName && styles.inputError
//                                 ]}>
//                                     <Ionicons name="person-outline" size={20} color="#888" />
//                                     <TextInput
//                                         style={styles.textInput}
//                                         placeholder="Enter your username"
//                                         placeholderTextColor="#999"
//                                         value={displayName}
//                                         editable={!isLoading}
//                                         onChangeText={(text) => {
//                                             setDisplayName(text);
//                                             setErrors((prev) => ({ ...prev, displayName: "" }));
//                                         }}
//                                         maxLength={30}
//                                         autoCapitalize="none"
//                                     />
//                                 </View>
//                                 {errors.displayName && (
//                                     <Text style={styles.errorText}>{errors.displayName}</Text>
//                                 )}
//                             </View>
//                             <Separator />
//                             <View >
//                                 <Text style={[styles.inputLabel, { marginTop: 10 }]}>Bio</Text>
//                                 <View style={styles.bioContainer}>
//                                     <TextInput
//                                         style={styles.bioInput}
//                                         placeholder="Tell us about yourself..."
//                                         placeholderTextColor="#999"
//                                         value={about}
//                                         editable={!isLoading}
//                                         onChangeText={setAbout}
//                                         multiline
//                                         numberOfLines={4}
//                                         maxLength={50}
//                                         textAlignVertical="top"
//                                     />
//                                 </View>
//                                 <Text style={styles.charCount}>{about.length}/50</Text>
//                             </View>
//                         </View>

//                         <Separator />

//                         <TouchableOpacity
//                             style={[
//                                 styles.continueButton,
//                                 shouldDisabled && styles.continueButtonDisabled,
//                             ]}
//                             onPress={handleContinue}
//                             disabled={shouldDisabled}
//                         >
//                             {isLoading ? (
//                                 <ActivityIndicator color="#fff" size="small" />
//                             ) : (
//                                 <>
//                                     <Text style={styles.continueButtonText}>Complete Setup</Text>
//                                     <Ionicons name="checkmark-circle" size={22} color="#fff" />
//                                 </>
//                             )}
//                         </TouchableOpacity>

//                     </View>


//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </ThemedSafeAreaView>
//     );
// }

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import ThemedSafeAreaView from '../../components/themedViews/safeAreaView';
import Separator from '../../components/ui/separator';
import { SetupProfileImage } from '../../components/profile/setupProfileImage';
import { useCloudinaryUpload } from '../../hooks/api/useCloudinaryUplaodApi';
import { useUpdateProfile, useUpdateProfilePicture } from '../../hooks/api/useProfileApi';
import { AuthBootstrap } from '../../utils/authBootstrap';
import { useAuthStore } from '../../hooks/store/useAuthStore';

interface FormErrors {
    displayName?: string;
}

export default function SetupProfile() {

    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [about, setAbout] = useState(user?.about || '');
    const [selectedImageAsset, setSelectedImageAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    const { mutateAsync: uploadToCloudinary, isPending: isUploadingImage, progress } = useCloudinaryUpload();
    const { mutateAsync: postUpdateProfilePicture, isPending: isSavingPic } = useUpdateProfilePicture();
    const { mutateAsync: postUpdateProfile, isPending: isUpdatingProfile } = useUpdateProfile();

    const isSubmitting = isUploadingImage || isSavingPic || isUpdatingProfile;

    const isUnchanged =
        displayName.trim() === (user?.displayName || '') &&
        about.trim() === (user?.about || '') &&
        !selectedImageAsset;

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!displayName.trim()) {
            newErrors.displayName = 'Username is required';
        } else if (displayName.trim().length < 3) {
            newErrors.displayName = 'Username must be at least 3 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = async () => {
        if (!validate()) return;

        try {
            if (selectedImageAsset) {
                const cloudinaryData = await uploadToCloudinary(selectedImageAsset);

                console.log(cloudinaryData, "cloudinaryData");
                await postUpdateProfilePicture(cloudinaryData);
            }

            const profileResponse = await postUpdateProfile({
                displayName: displayName.trim(),
                about: about.trim(),
            });

            await setUser(profileResponse);
            router.replace('/(tabs)/chats');
        } catch (err: any) {
            Alert.alert('Update Failed', err?.message || 'Unable to update profile. Please try again.');
        }
    };

    const handleSkip = () => {
        router.replace('/(tabs)/chats');
    };

    return (
        <ThemedSafeAreaView>
            <AuthBootstrap />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkip}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.skipButtonText}>Skip</Text>
                    </TouchableOpacity>

                    <Separator />

                    <SetupProfileImage
                        imageUri={selectedImageAsset?.uri || user?.profilePicture?.secureUrl || ""}
                        onImageSelected={setSelectedImageAsset}
                        isUploading={isSubmitting}
                    />

                    {isUploadingImage && (
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressText}>Uploading photo: {progress}%</Text>
                            <View style={styles.barBackground}>
                                <View style={[styles.barFill, { width: `${progress}%` }]} />
                            </View>
                        </View>
                    )}

                    <Separator />

                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>Username *</Text>
                        <View style={[styles.inputContainer, errors.displayName && styles.inputError]}>
                            <Ionicons name="person-outline" size={20} color="#888" />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter your username"
                                placeholderTextColor="#999"
                                value={displayName}
                                editable={!isSubmitting}
                                onChangeText={(text) => {
                                    setDisplayName(text);
                                    if (errors.displayName) setErrors((prev) => ({ ...prev, displayName: undefined }));
                                }}
                                maxLength={30}
                                autoCapitalize="none"
                            />
                        </View>
                        {errors.displayName && <Text style={styles.errorText}>{errors.displayName}</Text>}

                        <Text style={[styles.inputLabel, styles.bioLabel]}>Bio</Text>
                        <View style={styles.bioContainer}>
                            <TextInput
                                style={styles.bioInput}
                                placeholder="Tell us about yourself..."
                                placeholderTextColor="#999"
                                value={about}
                                editable={!isSubmitting}
                                onChangeText={setAbout}
                                multiline
                                numberOfLines={4}
                                maxLength={50}
                                textAlignVertical="top"
                            />
                        </View>
                        <Text style={styles.charCount}>{about.length}/50</Text>

                        <Separator />

                        <TouchableOpacity
                            style={[
                                styles.continueButton,
                                (isUnchanged || isSubmitting) && styles.continueButtonDisabled,
                            ]}
                            onPress={handleContinue}
                            disabled={isUnchanged || isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <>
                                    <Text style={styles.continueButtonText}>Complete Setup</Text>
                                    <Ionicons name="checkmark-circle" size={22} color="#fff" />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 16 },
    skipButton: { alignSelf: 'flex-end', padding: 8 },
    skipButtonText: { color: '#888', fontWeight: '600' },
    formContainer: { paddingVertical: 12 },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#888',
        marginBottom: 10
    },
    bioLabel: { marginTop: 16 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        gap: 8,
    },
    inputError: { borderColor: '#d32f2f' },
    textInput: { flex: 1, fontSize: 16, color: '#333' },
    bioContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        height: 100,
    },
    bioInput: { flex: 1, fontSize: 16, color: '#333' },
    errorText: { color: '#d32f2f', fontSize: 12, marginTop: 4 },
    charCount: { alignSelf: 'flex-end', fontSize: 12, color: '#888', marginTop: 4 },
    continueButton: {
        flexDirection: 'row',
        backgroundColor: '#259cd3',
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 8,
    },
    continueButtonDisabled: { opacity: 0.5 },
    continueButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    progressContainer: {
        marginVertical: 16,
        alignItems: 'center',
        width: '100%',
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#259cd3',
        marginBottom: 6,
    },
    barBackground: {
        height: 8,
        width: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: '#259cd3',
        borderRadius: 4,
    },
});


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     scrollContent: {
//         flex: 1,
//     },
//     inputLabel: {
//         fontSize: 14,
//         fontWeight: "600",
//         color: "#444",
//         marginBottom: 8,
//         paddingHorizontal: 15,
//     },
//     inputContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fcfcfcff",
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: "#e0e0e0",
//         borderStyle: "dashed",
//         paddingHorizontal: 14,
//         gap: 10,
//     },
//     inputError: {
//         borderColor: "#ff4444",
//     },
//     textInput: {
//         flex: 1,
//         paddingVertical: 14,
//         fontSize: 16,
//         color: "#1a1a1a",
//     },
//     bioContainer: {
//         backgroundColor: "#fafafaff",
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: "#e0e0e0",
//         paddingHorizontal: 14,
//         borderStyle: "dashed",
//         paddingTop: 10,
//     },
//     bioInput: {
//         fontSize: 16,
//         color: "#1a1a1a",
//         minHeight: 80,
//     },
//     charCount: {
//         textAlign: "right",
//         fontSize: 12,
//         color: "#888",
//         marginTop: 6,
//         paddingHorizontal: 15,
//     },
//     errorText: {
//         color: "#ff4444",
//         fontSize: 13,
//         marginTop: 6,
//         marginLeft: 4,
//     },
//     continueButton: {
//         flexDirection: "row",
//         backgroundColor: "#259cd3",
//         paddingVertical: 12,
//         borderRadius: 12,
//         justifyContent: "center",
//         alignItems: "center",
//         gap: 8,
//         // marginBottom: 15,
//         shadowColor: "#259cd3",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//         elevation: 5,
//     },
//     continueButtonDisabled: {
//         backgroundColor: "#b8cbe0",
//         shadowOpacity: 0,
//         elevation: 0,
//     },
//     continueButtonText: {
//         color: "#fff",
//         fontSize: 18,
//         fontWeight: "600",
//     },
//     skipButton: {
//         paddingVertical: 20,
//         paddingHorizontal: 15,
//     },
//     skipButtonText: {
//         fontSize: 16,
//         color: "#2b82d3ff",
//         fontWeight: "500",
//     },
// });
