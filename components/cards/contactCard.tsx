import { Text, TouchableOpacity, View, Image, StyleSheet, Share } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Contact } from "../../db/types/contact.type";

const WA_GREEN = "#25D366";
const TEXT_PRIMARY = "#111B21";
const TEXT_SECONDARY = "#667781";
const AVATAR_BG = "#DFE5E7";

interface ContactCardProps {
    contact: Contact;
}

const ContactCard = ({ contact }: ContactCardProps) => {
    const router = useRouter();
    const isRegistered = contact.isRegistered === 1;

    const handlePress = () => {
        if (isRegistered) {
            router.push(`/chats/${contact.phoneNumber}`);
        }
    };

    const handleInvite = async () => {
        try {
            await Share.share({
                message: `Hey! I'm using SudaChat. Join me: https://sudachat.app/invite`,
            });
        } catch (_) { }
    };

    // Generate initials from display name
    const initials = contact.displayName
        ?.split(" ")
        .slice(0, 2)
        .map(w => w[0])
        .join("")
        .toUpperCase() || "?";

    // Deterministic pastel color from name
    const avatarColor = AVATAR_COLORS[
        (contact.displayName?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length
    ];

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={isRegistered ? 0.6 : 1}
            style={styles.row}
        >
            {/* Avatar */}
            <View style={[styles.avatarContainer, { backgroundColor: avatarColor.bg }]}>
                {isRegistered && contact.profilePicture ? (
                    <Image
                        source={{ uri: contact.profilePicture }}
                        style={styles.avatarImage}
                    />
                ) : (
                    <Text style={[styles.avatarInitials, { color: avatarColor.text }]}>
                        {initials}
                    </Text>
                )}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>
                        {contact.displayName}
                    </Text>
                    {isRegistered && (
                        <View style={styles.badge}>
                            <Ionicons name="chatbubble" size={10} color="#fff" />
                        </View>
                    )}
                </View>

                <Text style={styles.sub} numberOfLines={1}>
                    {isRegistered
                        ? contact.about || contact.phoneNumber
                        : contact.phoneNumber}
                </Text>
            </View>

            {/* Right action */}
            {!isRegistered ? (
                <TouchableOpacity
                    onPress={handleInvite}
                    style={styles.inviteBtn}
                    activeOpacity={0.7}
                >
                    <Text style={styles.inviteText}>Invite</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={handlePress}
                    style={styles.chatBtn}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chatbubble-ellipses" size={20} color={WA_GREEN} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

// Soft pastel pairs (bg + text) — WhatsApp uses these for default avatars
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
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#fff",
        gap: 12,
    },

    // Avatar
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        flexShrink: 0,
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    avatarInitials: {
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 0.5,
    },

    // Content
    content: {
        flex: 1,
        justifyContent: "center",
        gap: 3,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: TEXT_PRIMARY,
        flexShrink: 1,
    },
    badge: {
        backgroundColor: WA_GREEN,
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    sub: {
        fontSize: 13,
        color: TEXT_SECONDARY,
        lineHeight: 18,
    },

    // Actions
    inviteBtn: {
        borderWidth: 1.5,
        borderColor: WA_GREEN,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 5,
        flexShrink: 0,
    },
    inviteText: {
        color: WA_GREEN,
        fontSize: 13,
        fontWeight: "700",
    },
    chatBtn: {
        padding: 6,
        flexShrink: 0,
    },
});

export default ContactCard;
