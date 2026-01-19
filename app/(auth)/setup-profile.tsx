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
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ThemedSafeAreaView from "../../components/themedViews/safeAreaView";
import Separator from "../../components/ui/separator";
import { SetupProfileImage } from "../../components/profile/setupProfileImage";

interface Errors {
    username?: string;
    birthDate?: string;
};


export default function SetupProfile() {
    const router = useRouter();


    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [errors, setErrors] = useState<Errors>({});



    const handleContinue = async () => {
        // if (!validateForm()) return;

        try {


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
                    <SetupProfileImage />

                    <Separator />

                    <View >
                        <Separator />
                        <View >
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
                        <View >
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
