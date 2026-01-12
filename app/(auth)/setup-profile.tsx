import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import ThemedSafeAreaView from "../../components/themedViews/safeAreaView";

interface Errors {
    username?: string;
    birthDate?: string;
}

export default function SetupProfile() {
    const router = useRouter();

    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [bio, setBio] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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

    const handleBirthDateChange = (text: string) => {
        let cleaned = text.replace(/[^0-9]/g, "");
        if (cleaned.length >= 2) {
            cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
        }
        if (cleaned.length >= 5) {
            cleaned = cleaned.slice(0, 5) + "/" + cleaned.slice(5);
        }
        if (cleaned.length > 10) {
            cleaned = cleaned.slice(0, 10);
        }
        setBirthDate(cleaned);
        setErrors((prev) => ({ ...prev, birthDate: "" }));
    };

    const validateForm = () => {
        const newErrors: Errors = {};

        if (!username.trim()) {
            newErrors.username = "Username is required";
        } else if (username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!birthDate) {
            newErrors.birthDate = "Birth date is required";
        } else if (birthDate.length !== 10) {
            newErrors.birthDate = "Please enter a valid date (DD/MM/YYYY)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            console.log("Profile data:", {
                profileImage,
                username,
                birthDate,
                bio,
            });

            router.replace("/(tabs)/chat" as any);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        router.replace("/(tabs)/chat" as any);
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
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Set up your profile</Text>
                        <Text style={styles.subtitle}>
                            Add a photo and some info about yourself
                        </Text>
                    </View>

                    <View style={styles.imageSection}>
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
                    </View>

                    <View style={styles.formSection}>
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

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Birth Date *</Text>
                            <View style={[
                                styles.inputContainer,
                                errors.birthDate && styles.inputError
                            ]}>
                                <Ionicons name="calendar-outline" size={20} color="#888" />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="DD/MM/YYYY"
                                    placeholderTextColor="#999"
                                    value={birthDate}
                                    onChangeText={handleBirthDateChange}
                                    keyboardType="number-pad"
                                    maxLength={10}
                                />
                            </View>
                            {errors.birthDate && (
                                <Text style={styles.errorText}>{errors.birthDate}</Text>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Bio</Text>
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

                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            isLoading && styles.continueButtonDisabled,
                        ]}
                        onPress={handleContinue}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Text style={styles.continueButtonText}>Complete Setup</Text>
                                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkip}
                    >
                        <Text style={styles.skipButtonText}>Skip for now</Text>
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
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingTop: 40,
        paddingBottom: 30,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    imageSection: {
        alignItems: "center",
        marginBottom: 35,
    },
    imageContainer: {
        position: "relative",
        marginBottom: 15,
    },
    profileImage: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: "#f0f0f0",
    },
    imagePlaceholder: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#e0e0e0",
        borderStyle: "dashed",
    },
    editBadge: {
        position: "absolute",
        bottom: 5,
        right: 5,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#259cd3",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#fff",
    },
    imageButtons: {
        flexDirection: "row",
        gap: 20,
    },
    imageOptionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "#e8f4f8",
    },
    imageOptionText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#259cd3",
    },
    formSection: {
        marginBottom: 25,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#444",
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#e0e0e0",
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
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#e0e0e0",
        paddingHorizontal: 14,
        paddingTop: 12,
    },
    bioInput: {
        fontSize: 16,
        color: "#1a1a1a",
        minHeight: 100,
    },
    charCount: {
        textAlign: "right",
        fontSize: 12,
        color: "#888",
        marginTop: 6,
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
        marginBottom: 15,
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
        alignItems: "center",
        paddingVertical: 12,
    },
    skipButtonText: {
        fontSize: 16,
        color: "#888",
        fontWeight: "500",
    },
});
