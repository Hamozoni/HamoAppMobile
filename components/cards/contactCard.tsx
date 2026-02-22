import { Text, TouchableOpacity, View, StyleSheet, Share } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Contact } from "../../db/types/contact.type";
import { useAuthStore } from "../../hooks/store/useAuthStore";
import Avatar from "../ui/avatar";

const WA_GREEN = "#2585d3ff";
const TEXT_PRIMARY = "#111B21";
const TEXT_SECONDARY = "#667781";
const AVATAR_BG = "#DFE5E7";

interface ContactCardProps {
    contact: Contact;
}

const ContactCard = ({ contact }: ContactCardProps) => {
    const router = useRouter();
    const isRegistered = contact.isRegistered === 1;

    const user = useAuthStore(state => state.user)

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
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={isRegistered ? 0.6 : 1}
            style={styles.row}
        >
            {/* Avatar */}
            <Avatar profilePicture={contact.profilePicture} displayName={contact.displayName} isRegistered={isRegistered} />

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>
                        {contact.displayName} {user?.phoneNumber === contact.phoneNumber && ' ( You )'}
                    </Text>
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
                    <View style={styles.badge}>
                        <Ionicons name="chatbubble" size={16} color="#fff" />
                    </View>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#fff",
        gap: 12,
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
        width: 22,
        height: 22,
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
