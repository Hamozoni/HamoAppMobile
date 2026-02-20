import { useState, useRef } from "react";
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
import ThemedSafeAreaView from "../../components/themedViews/safeAreaView";
import { useSendOpt } from "../../hooks/api/useSendOpt";

// Type for country code
interface CountryCode {
    code: string;
    country: string;
    flag: string;
}

// Country codes data
const COUNTRY_CODES: CountryCode[] = [
    { code: "+1", country: "US", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+249", country: "SD", flag: "🇸🇩" },
    { code: "+966", country: "SA", flag: "🇸🇦" },
    { code: "+971", country: "AE", flag: "🇦🇪" },
    { code: "+20", country: "EG", flag: "🇪🇬" },
    { code: "+91", country: "IN", flag: "🇮🇳" },
    { code: "+86", country: "CN", flag: "🇨🇳" },
    { code: "+251", country: "ET", flag: "🇪🇹" },
    { code: "+973", country: "BH", flag: "🇧🇭" },
    { code: "+974", country: "QA", flag: "🇶🇦" },
    { code: "+965", country: "KW", flag: "🇰🇼" },
    { code: "+967", country: "OM", flag: "🇴🇲" },
];


export default function Login() {
    const router = useRouter();
    const phoneInputRef = useRef<TextInput>(null);

    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [countryCode, setCountryCode] = useState<string>("");
    const [countryISO, setCountryISO] = useState<string>("");
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[2]); // Default to Sudan
    const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
    const [error, setError] = useState<string>("");


    const { mutateAsync: sendOpt, isPending: isLoading } = useSendOpt();


    const handlePhoneChange = (text: string): void => {
        // Only allow numbers
        const cleaned = text.replace(/[^0-9]/g, "");
        setPhoneNumber(cleaned);
        setError("");
    };

    const validatePhone = (): boolean => {
        if (!phoneNumber || phoneNumber.length < 9) {
            setError("Please enter a valid phone number");
            return false;
        }
        return true;
    };

    const handleContinue = async (): Promise<void> => {
        if (!validatePhone()) return;
        try {
            const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;
            await sendOpt(fullPhoneNumber)
            router.push({
                pathname: "/(auth)/verify",
                params: { phoneNumber: fullPhoneNumber, countryCode, countryISO }
            });
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    const selectCountry = (country: CountryCode): void => {
        setSelectedCountry(country);
        setShowCountryPicker(false);
        setCountryCode(country.code);
        setCountryISO(country.country);
        phoneInputRef.current?.focus();
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
                    {/* Logo & Header */}
                    <View style={styles.headerContainer}>
                        <Image
                            source={require("../../assets/images/sudaChat.jpg")}
                            style={{ width: 200, height: 200 }}
                        />

                        <Text style={styles.title}>Welcome to SudaChat</Text>
                        <Text style={styles.subtitle}>
                            Enter your phone number to get started
                        </Text>
                    </View>

                    {/* Phone Input Section */}
                    <View style={styles.inputSection}>
                        <Text style={styles.inputLabel}>Phone Number</Text>

                        <View style={styles.phoneInputContainer}>
                            {/* Country Code Selector */}
                            <TouchableOpacity
                                style={styles.countrySelector}
                                onPress={() => setShowCountryPicker(!showCountryPicker)}
                            >
                                <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                                <Text style={styles.countryCode}>{selectedCountry.code}</Text>
                                <Ionicons
                                    name={showCountryPicker ? "chevron-up" : "chevron-down"}
                                    size={18}
                                    color="#666"
                                />
                            </TouchableOpacity>

                            {/* Phone Number Input */}
                            <TextInput
                                ref={phoneInputRef}
                                style={styles.phoneInput}
                                placeholder="Enter your number"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={handlePhoneChange}
                                maxLength={15}
                            />
                        </View>

                        {/* Country Picker Dropdown */}
                        {showCountryPicker && (
                            <View style={styles.countryPickerDropdown}>
                                <ScrollView
                                    style={styles.countryList}
                                    nestedScrollEnabled
                                >
                                    {COUNTRY_CODES.map((country) => (
                                        <TouchableOpacity
                                            key={country.code}
                                            style={[
                                                styles.countryOption,
                                                selectedCountry.code === country.code &&
                                                styles.countryOptionSelected,
                                            ]}
                                            onPress={() => selectCountry(country)}
                                        >
                                            <Text style={styles.countryOptionFlag}>
                                                {country.flag}
                                            </Text>
                                            <Text style={styles.countryOptionText}>
                                                {country.country}
                                            </Text>
                                            <Text style={styles.countryOptionCode}>
                                                {country.code}
                                            </Text>
                                            {selectedCountry.code === country.code && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={20}
                                                    color="#25D366"
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {/* Error Message */}
                        {error ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={18} color="#ff4444" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {/* Info Text */}
                        <View style={styles.infoContainer}>
                            <Ionicons name="information-circle-outline" size={20} color="#888" />
                            <Text style={styles.infoText}>
                                We'll send you a verification code via Telegram to confirm your number.
                            </Text>
                        </View>
                    </View>

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            (!phoneNumber || isLoading) && styles.continueButtonDisabled,
                        ]}
                        onPress={handleContinue}
                        disabled={!phoneNumber || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Text style={styles.continueButtonText}>Continue</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Terms Text */}
                    <Text style={styles.termsText}>
                        By continuing, you agree to our{" "}
                        <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>
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
        marginBottom: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#0a4072ff",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#949daaff",
        textAlign: "center",
        paddingHorizontal: 20,
    },
    inputSection: {
        marginBottom: 30,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#444",
        marginBottom: 10,
    },
    phoneInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#e0e0e0",
        overflow: "hidden",
    },
    countrySelector: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRightWidth: 1,
        borderRightColor: "#e0e0e0",
        backgroundColor: "#fafafa",
        gap: 5,
    },
    countryFlag: {
        fontSize: 24,
    },
    countryCode: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 12,
        fontSize: 16,
        fontWeight: "500",
        color: "#1a1a1a",
        letterSpacing: 1,
    },
    countryPickerDropdown: {
        marginTop: 8,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        maxHeight: 250,
    },
    countryList: {
        padding: 8,
    },
    countryOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 10,
    },
    countryOptionSelected: {
        backgroundColor: "#e8f8ef",
    },
    countryOptionFlag: {
        fontSize: 24,
    },
    countryOptionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    countryOptionCode: {
        fontSize: 15,
        color: "#666",
        marginRight: 8,
    },
    errorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        gap: 6,
    },
    errorText: {
        color: "#ff4444",
        fontSize: 14,
        fontWeight: "500",
    },
    infoContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 16,
        gap: 8,
        paddingRight: 10,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: "#888",
        lineHeight: 18,
    },
    continueButton: {
        flexDirection: "row",
        backgroundColor: "#1b7ba1ff",
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
        shadowColor: "#1b7ba1ff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    continueButtonDisabled: {
        backgroundColor: "#a8e2fdff",
        shadowOpacity: 0,
        elevation: 0,
    },
    continueButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    termsText: {
        textAlign: "center",
        fontSize: 13,
        color: "#888",
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    termsLink: {
        color: "#2585d3ff",
        fontWeight: "600",
    },
});
