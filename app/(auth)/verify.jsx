import { useState, useRef, useEffect } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import ThemedSafeAreaView from "../../components/themedViews/safeAreaView";

const OTP_LENGTH = 6;
const RESEND_TIMER = 60;

export default function Verify() {
    const router = useRouter();
    const { phone } = useLocalSearchParams();

    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(RESEND_TIMER);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef([]);

    // Countdown timer for resend
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    // Focus first input on mount
    useEffect(() => {
        setTimeout(() => inputRefs.current[0]?.focus(), 300);
    }, []);

    const handleOtpChange = (value, index) => {
        // Only allow single digit
        const digit = value.replace(/[^0-9]/g, "").slice(-1);

        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        setError("");

        // Move to next input
        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when complete
        if (digit && index === OTP_LENGTH - 1) {
            const fullOtp = newOtp.join("");
            if (fullOtp.length === OTP_LENGTH) {
                handleVerify(fullOtp);
            }
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (code) => {
        const otpCode = code || otp.join("");

        if (otpCode.length !== OTP_LENGTH) {
            setError("Please enter the complete verification code");
            return;
        }

        setIsLoading(true);
        try {
            // Here you would verify the OTP with Firebase
            console.log("Verifying OTP:", otpCode);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Navigate to profile setup
            router.replace("/(auth)/setup-profile");
        } catch (err) {
            setError("Invalid verification code. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!canResend) return;

        setCanResend(false);
        setResendTimer(RESEND_TIMER);
        setOtp(Array(OTP_LENGTH).fill(""));
        setError("");

        try {
            // Here you would resend the OTP via Firebase
            console.log("Resending OTP to:", phone);
            // Show success feedback
        } catch (err) {
            setError("Failed to resend code. Please try again.");
            console.error(err);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const isOtpComplete = otp.every((digit) => digit !== "");

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
                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="shield-checkmark" size={55} color="#258dd3ff" />
                        </View>
                        <Text style={styles.title}>Verify your number</Text>
                        <Text style={styles.subtitle}>
                            Enter the 6-digit code sent to
                        </Text>
                        <Text style={styles.phoneNumber}>{phone || "+249 XX XXX XXXX"}</Text>
                    </View>

                    {/* OTP Input */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={[
                                    styles.otpInput,
                                    digit && styles.otpInputFilled,
                                    error && styles.otpInputError,
                                ]}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {/* Error Message */}
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={18} color="#ff4444" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Resend Timer */}
                    <View style={styles.resendContainer}>
                        {canResend ? (
                            <TouchableOpacity onPress={handleResendCode}>
                                <Text style={styles.resendButton}>Resend Code</Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.resendTimer}>
                                Resend code in{" "}
                                <Text style={styles.timerHighlight}>
                                    {formatTime(resendTimer)}
                                </Text>
                            </Text>
                        )}
                    </View>

                    {/* Verify Button */}
                    <TouchableOpacity
                        style={[
                            styles.verifyButton,
                            (!isOtpComplete || isLoading) && styles.verifyButtonDisabled,
                        ]}
                        onPress={() => handleVerify()}
                        disabled={!isOtpComplete || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Text style={styles.verifyButtonText}>Verify</Text>
                                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Help Text */}
                    <View style={styles.helpContainer}>
                        <Ionicons name="help-circle-outline" size={20} color="#888" />
                        <Text style={styles.helpText}>
                            Didn't receive the code? Check your Telegram messages or try resending.
                        </Text>
                    </View>

                    {/* Change Number Link */}
                    <TouchableOpacity
                        style={styles.changeNumberButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="pencil" size={16} color="#2593d3ff" />
                        <Text style={styles.changeNumberText}>Change phone number</Text>
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
        paddingTop: 20,
        paddingBottom: 30,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    iconContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#e8f4f8ff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 25,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: 12,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    phoneNumber: {
        fontSize: 18,
        fontWeight: "600",
        color: "#206ba8ff",
        marginTop: 6,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginBottom: 20,
    },
    otpInput: {
        width: 48,
        height: 56,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#e0e0e0",
        backgroundColor: "#f9f9f9",
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        color: "#1a1a1a",
    },
    otpInputFilled: {
        borderColor: "#25b0d3ff",
        backgroundColor: "#e8f8ef",
    },
    otpInputError: {
        borderColor: "#ff4444",
        backgroundColor: "#fff5f5",
    },
    errorContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
        gap: 6,
    },
    errorText: {
        color: "#ff4444",
        fontSize: 14,
        fontWeight: "500",
    },
    resendContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    resendTimer: {
        fontSize: 15,
        color: "#888",
    },
    timerHighlight: {
        color: "#2aa4d4ff",
        fontWeight: "600",
    },
    resendButton: {
        fontSize: 16,
        color: "#258dd3ff",
        fontWeight: "600",
    },
    verifyButton: {
        flexDirection: "row",
        backgroundColor: "#259cd3ff",
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginBottom: 25,
        shadowColor: "#257fd3ff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    verifyButtonDisabled: {
        backgroundColor: "#b8cbe0ff",
        shadowOpacity: 0,
        elevation: 0,
    },
    verifyButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    helpContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        paddingHorizontal: 10,
        marginBottom: 25,
    },
    helpText: {
        flex: 1,
        fontSize: 13,
        color: "#888",
        lineHeight: 18,
    },
    changeNumberButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    changeNumberText: {
        fontSize: 15,
        color: "#259cd3ff",
        fontWeight: "600",
    },
});
