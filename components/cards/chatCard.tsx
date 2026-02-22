import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Chat, MessageType } from "../../types/components.types";

const WA_GREEN = "#25D366";
const TEXT_PRIMARY = "#111B21";
const TEXT_SECONDARY = "#667781";

interface ChatCardProps {
    chat: Chat;
    isSelected?: boolean;
    isEditMode?: boolean;
    onSelect?: () => void;
}

// Config for each message type
const MESSAGE_TYPE_CONFIG: Record<MessageType, {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    label?: string; // fallback label if no text
}> = {
    text: { icon: "chatbubble-outline", color: TEXT_SECONDARY },
    audio: { icon: "mic-outline", color: "#8B5CF6" },
    image: { icon: "image-outline", color: "#0EA5E9" },
    video: { icon: "videocam-outline", color: "#F59E0B" },
    location: { icon: "location-outline", color: "#EF4444" },
    contact: { icon: "person-circle-outline", color: "#10B981" },
};

const MessagePreview = ({ lastMessage }: { lastMessage: Chat["lastMessage"] }) => {
    const { type, text, isMine, isRead } = lastMessage;
    const config = MESSAGE_TYPE_CONFIG[type];
    const isText = type === "text";

    return (
        <View style={styles.messageRow}>
            {/* Sent checkmarks for my messages */}
            {isMine && (
                <Ionicons
                    name={isRead ? "checkmark-done" : "checkmark"}
                    size={14}
                    color={isRead ? WA_GREEN : TEXT_SECONDARY}
                    style={styles.tick}
                />
            )}

            {/* Type icon — skip for plain text */}
            {!isText && (
                <View style={[styles.typeIconWrap, { backgroundColor: config.color + "18" }]}>
                    <Ionicons name={config.icon} size={12} color={config.color} />
                </View>
            )}

            {/* Message text / label */}
            <Text style={styles.messageText} numberOfLines={1}>
                {text ?? config.label}
            </Text>
        </View>
    );
};

export const ChatCard = ({ chat, isSelected, isEditMode, onSelect }: ChatCardProps) => {
    const router = useRouter();
    const hasUnread = (chat.unreadCount ?? 0) > 0;

    return (
        <TouchableOpacity
            onPress={() => isEditMode ? onSelect?.() : router.push(`/chats/${chat.id}` as any)}
            onLongPress={onSelect}
            activeOpacity={0.6}
            style={styles.row}
        >
            {/* Edit checkbox */}
            {isEditMode && (
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
            )}

            {/* Avatar + online dot */}
            <View style={styles.avatarWrapper}>
                <Image source={{ uri: chat.contact.photoURL as string }} style={styles.avatar} />
                {chat.isOnline && <View style={styles.onlineDot} />}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text style={styles.name} numberOfLines={1}>
                        {chat.contact.displayName}
                    </Text>
                    <Text style={[styles.time, hasUnread && styles.timeUnread]}>
                        {chat.lastMessage?.createdAt}
                    </Text>
                </View>

                <View style={styles.bottomRow}>
                    <View style={styles.previewWrap}>
                        <MessagePreview lastMessage={chat.lastMessage} />
                    </View>
                    {hasUnread && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {(chat.unreadCount ?? 0) > 99 ? "99+" : chat.unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        backgroundColor: "#fff",
        gap: 12,
    },

    // ── Checkbox ─────────────────────────────────
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#C8C8C8",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
    },
    checkboxSelected: {
        backgroundColor: WA_GREEN,
        borderColor: WA_GREEN,
    },

    // ── Avatar ───────────────────────────────────
    avatarWrapper: {
        position: "relative",
        flexShrink: 0,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#DFE5E7",
    },
    onlineDot: {
        position: "absolute",
        bottom: 1,
        right: 1,
        width: 13,
        height: 13,
        borderRadius: 7,
        backgroundColor: WA_GREEN,
        borderWidth: 2,
        borderColor: "#fff",
    },

    // ── Content ──────────────────────────────────
    content: {
        flex: 1,
        paddingVertical: 14,
        paddingRight: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E9ECEE",
        gap: 4,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: TEXT_PRIMARY,
        flex: 1,
        marginRight: 8,
    },
    time: {
        fontSize: 12,
        color: TEXT_SECONDARY,
        flexShrink: 0,
    },
    timeUnread: {
        color: WA_GREEN,
        fontWeight: "600",
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    previewWrap: {
        flex: 1,
        marginRight: 8,
    },

    // ── Message preview ───────────────────────────
    messageRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    tick: {
        flexShrink: 0,
    },
    typeIconWrap: {
        width: 20,
        height: 20,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
    },
    messageText: {
        fontSize: 14,
        color: TEXT_SECONDARY,
        flex: 1,
    },

    // ── Unread badge ──────────────────────────────
    badge: {
        backgroundColor: WA_GREEN,
        borderRadius: 12,
        minWidth: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
        flexShrink: 0,
    },
    badgeText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "700",
    },
});
