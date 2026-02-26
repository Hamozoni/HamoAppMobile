import { Image, StyleSheet, Text, View } from "react-native";
interface AvatarProps {
    profilePicture: string | null | undefined;
    displayName: string | null | undefined;
    isRegistered?: boolean;
    width?: number;
    height?: number;
}
export default function Avatar({ profilePicture, displayName, isRegistered = true, width = 40, height = 40 }: AvatarProps) {
    // Generate initials from display name
    const initials = displayName
        ?.split(" ")
        .slice(0, 2)
        .map(w => w[0])
        .join("")
        .toUpperCase() || "?";

    // Deterministic pastel color from name
    const avatarColor = AVATAR_COLORS[
        (displayName?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length
    ];
    return (
        <View style={[styles.avatarContainer, { backgroundColor: avatarColor.bg, width, height }]}>
            {isRegistered && profilePicture ? (
                <Image
                    source={{ uri: profilePicture }}
                    style={[styles.avatarImage, { width, height }]}
                />
            ) : (
                <Text style={[styles.avatarInitials, { color: avatarColor.text, fontSize: (width / 2) - 2 }]}>
                    {initials}
                </Text>
            )}
        </View>
    )
};

const AVATAR_COLORS = [
    { bg: "#F0E6FF", text: "#7C3AED" },
    { bg: "#FEE2E2", text: "#DC2626" },
    { bg: "#DBEAFE", text: "#1D4ED8" },
    { bg: "#D1FAE5", text: "#065F46" },
    { bg: "#FEF3C7", text: "#92400E" },
    { bg: "#FCE7F3", text: "#9D174D" },
    { bg: "#E0F2FE", text: "#0369A1" },
    { bg: "#F3F4F6", text: "#374151" },
];

const styles = StyleSheet.create({
    avatarContainer: {
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        flexShrink: 0,
    },
    avatarImage: {
        borderRadius: 28,
    },
    avatarInitials: {
        fontWeight: "700",
        letterSpacing: 0.5,
    },

})