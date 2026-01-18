import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    ActivityIndicator,
    ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import ThemedSafeAreaView from "../../components/themedViews/safeAreaView";
import ThemedViewContainer from "../../components/themedViews/ThemedViewContainer";
import Separator from "../../components/ui/separator";
import * as SecureStore from 'expo-secure-store';
import { useProfilePictureSignature } from "../../hooks/useProfilePicureSignature";
interface Errors {
    username?: string;
    birthDate?: string;
}

export default function SetupProfile() {
    const router = useRouter();

    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [errors, setErrors] = useState<Errors>({});

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
            setProfileImage(result.assets[0].uri);
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
            setProfileImage(result.assets[0].uri);
        }
    };

    const validateForm = () => {
        const newErrors: Errors = {};

        if (!username.trim()) {
            newErrors.username = "Username is required";
        } else if (username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        (async () => {
            const accessToken = await SecureStore.getItemAsync("accessToken");
            const refreshToken = await SecureStore.getItemAsync("refreshToken");
            console.log("accessToken", accessToken);
            console.log("refreshToken", refreshToken);

        })()
    }, []);

    const { mutateAsync: postProfilePictureSignature } = useProfilePictureSignature();

    const handleContinue = async () => {
        // if (!validateForm()) return;

        try {
            if (profileImage) {
                const data = await postProfilePictureSignature();
                console.log(data);
            }

            // router.replace("/(tabs)/chat" as string);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSkip = () => {
        router.replace("/(tabs)/chat" as string);
    };

    return (
        <ThemedSafeAreaView>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                    >
                        <Text style={styles.skipButtonText}>Skip</Text>
                    </TouchableOpacity>
                    <Separator />
                    <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, borderStyle: 'dashed' }}>

                        <ImageBackground source={require('../../assets/images/sudaChat.jpg')} style={styles.imageSection}>
                            <TouchableOpacity
                                style={styles.imageContainer}
                                onPress={pickImage}
                            >
                                {profileImage ? (
                                    <Image
                                        source={{ uri: profileImage }}
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


                    <Separator />

                    <View >
                        <Separator />
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Username *</Text>
                            <View style={[
                                styles.inputContainer,
                                errors.username && styles.inputError
                            ]}>
                                <Ionicons name="person-outline" size={20} color="#888" />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter your username"
                                    placeholderTextColor="#999"
                                    value={username}
                                    onChangeText={(text) => {
                                        setUsername(text);
                                        setErrors((prev) => ({ ...prev, username: "" }));
                                    }}
                                    maxLength={30}
                                    autoCapitalize="none"
                                />
                            </View>
                            {errors.username && (
                                <Text style={styles.errorText}>{errors.username}</Text>
                            )}
                        </View>
                        <Separator />
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { marginTop: 10 }]}>Bio</Text>
                            <View style={styles.bioContainer}>
                                <TextInput
                                    style={styles.bioInput}
                                    placeholder="Tell us about yourself..."
                                    placeholderTextColor="#999"
                                    value={bio}
                                    onChangeText={setBio}
                                    multiline
                                    numberOfLines={4}
                                    maxLength={50}
                                    textAlignVertical="top"
                                />
                            </View>
                            <Text style={styles.charCount}>{bio.length}/50</Text>
                        </View>
                    </View>

                    <Separator />

                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            false && styles.continueButtonDisabled,
                        ]}
                        onPress={handleContinue}
                        disabled={false}
                    >
                        {false ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Text style={styles.continueButtonText}>Complete Setup</Text>
                                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flex: 1,
    },
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
    },
    inputGroup: {
        // marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#444",
        marginBottom: 8,
        paddingHorizontal: 15,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fcfcfcff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderStyle: "dashed",
        paddingHorizontal: 14,
        gap: 10,
    },
    inputError: {
        borderColor: "#ff4444",
    },
    textInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: "#1a1a1a",
    },
    bioContainer: {
        backgroundColor: "#fafafaff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        paddingHorizontal: 14,
        borderStyle: "dashed",
        paddingTop: 10,
    },
    bioInput: {
        fontSize: 16,
        color: "#1a1a1a",
        minHeight: 80,
    },
    charCount: {
        textAlign: "right",
        fontSize: 12,
        color: "#888",
        marginTop: 6,
        paddingHorizontal: 15,
    },
    errorText: {
        color: "#ff4444",
        fontSize: 13,
        marginTop: 6,
        marginLeft: 4,
    },
    continueButton: {
        flexDirection: "row",
        backgroundColor: "#259cd3",
        paddingVertical: 12,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        // marginBottom: 15,
        shadowColor: "#259cd3",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    continueButtonDisabled: {
        backgroundColor: "#b8cbe0",
        shadowOpacity: 0,
        elevation: 0,
    },
    continueButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    skipButton: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    skipButtonText: {
        fontSize: 16,
        color: "#2b82d3ff",
        fontWeight: "500",
    },
});
