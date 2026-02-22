import { Image, Text, TouchableOpacity, View, StyleSheet, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Call } from "../../types/components.types";

const WA_GREEN = "#25D366";
const TEXT_PRIMARY = "#111B21";
const TEXT_SECONDARY = "#667781";
const MISSED_RED = "#FF3B30";
const OUTGOING_BLUE = "#007AFF";

interface CallCardProps {
    call: Call;
}

type CallType = "missed" | "incoming" | "outgoing";

const CALL_CONFIG: Record<CallType, {
    arrowIcon: string;
    arrowColor: string;
    labelColor: string;
    bgColor: string;
    callTypeIcon: string;
    callTypeColor: string;
    label: string;
}> = {
    missed: {
        arrowIcon: "arrow-down",
        arrowColor: MISSED_RED,
        labelColor: MISSED_RED,
        bgColor: "#FFF0F0",
        callTypeIcon: "call",
        callTypeColor: MISSED_RED,
        label: "Missed",
    },
    incoming: {
        arrowIcon: "arrow-down",
        arrowColor: WA_GREEN,
        labelColor: TEXT_SECONDARY,
        bgColor: "#E8FAF0",
        callTypeIcon: "call",
        callTypeColor: WA_GREEN,
        label: "Incoming",
    },
    outgoing: {
        arrowIcon: "arrow-up",
        arrowColor: OUTGOING_BLUE,
        labelColor: TEXT_SECONDARY,
        bgColor: "#EEF4FF",
        callTypeIcon: "call",
        callTypeColor: OUTGOING_BLUE,
        label: "Outgoing",
    },
};

export const CallCard = ({ call }: CallCardProps) => {
    const imageSource: ImageSourcePropType = call?.caller?.photoURL
        ? { uri: call.caller.photoURL }
        : require("../../assets/images/pexels-al-amin-muhammad-988616478-29680723.jpg");

    const callType: CallType =
        (call?.status?.toLowerCase() as CallType) ?? "incoming";
    const config = CALL_CONFIG[callType] ?? CALL_CONFIG.incoming;

    return (
        <View style={styles.row}>
            {/* Avatar */}
            <View style={styles.avatarWrapper}>
                <Image source={imageSource} style={styles.avatar} />
                {/* Call type badge on avatar */}
                <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
                    <Ionicons
                        name={config.arrowIcon as any}
                        size={9}
                        color={config.arrowColor}
                    />
                </View>
            </View>

            {/* Middle */}
            <View style={styles.content}>
                <Text
                    style={[styles.name, { color: config.labelColor }]}
                    numberOfLines={1}
                >
                    {call?.caller?.displayName}
                </Text>

                {/* Call type row with icon + label */}
                <View style={styles.typeRow}>
                    <View style={[styles.typeTag, { backgroundColor: config.bgColor }]}>
                        <Ionicons
                            name={config.callTypeIcon as any}
                            size={11}
                            color={config.callTypeColor}
                        />
                        <Text style={[styles.typeLabel, { color: config.callTypeColor }]}>
                            {config.label}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Right */}
            <View style={styles.right}>
                <Text style={styles.time}>{call?.caller?.created}</Text>
                <TouchableOpacity hitSlop={8}>
                    <Ionicons
                        name="information-circle-outline"
                        size={22}
                        color={config.arrowColor}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,

        paddingVertical: 4,
        backgroundColor: "#fff",
        gap: 12,
    },

    // ── Avatar ──────────────────────────────────
    avatarWrapper: {
        position: "relative",
        flexShrink: 0,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#DFE5E7",
    },
    badge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#fff",
    },

    // ── Content ─────────────────────────────────
    content: {
        flex: 1,
        justifyContent: "center",
        gap: 5,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E9ECEE",
    },
    name: {
        fontSize: 16,
        fontWeight: "500",
    },
    typeRow: {
        flexDirection: "row",
    },
    typeTag: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
    },
    typeLabel: {
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.2,
    },

    // ── Right ────────────────────────────────────
    right: {
        alignItems: "flex-end",
        gap: 6,
        paddingVertical: 14,
        paddingRight: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E9ECEE",
    },
    time: {
        fontSize: 12,
        color: "#667781",
    },
});