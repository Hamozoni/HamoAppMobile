
import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ILocalMessage } from "../../../types/message.types";

const WA_GREEN = "#25D366";
const MISSED_RED = "#FF3B30";


export default function CallMessageBubble({ message, isMine }: { message: ILocalMessage, isMine: boolean }) {
    const isVideo = message?.file?.metadata?.type === "video";
    const isMissed = message?.file?.metadata?.status === "missed";


    const iconColor = isMissed ? MISSED_RED : WA_GREEN;
    const arrowIcon = isMine ? "arrow-up" : "arrow-down";

    return (
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            {/* Call type icon */}
            <View style={[styles.iconCircle, { backgroundColor: iconColor + "18" }]}>
                <Ionicons
                    name={isVideo ? "videocam" : "call"}
                    size={20}
                    color={iconColor}
                />
            </View>

            {/* Info */}
            <View style={styles.info}>
                <Text style={styles.callType}>
                    {isVideo ? "Video Call" : "Voice Call"}
                </Text>
                <View style={styles.statusRow}>
                    <Ionicons name={arrowIcon as any} size={12} color={iconColor} />
                    <Text style={[styles.statusText, { color: iconColor }]}>
                        {isMissed ? "No answer" : message?.file?.metadata?.duration}
                    </Text>
                </View>
            </View>

            {/* Callback button */}
            <TouchableOpacity style={styles.callbackBtn}>
                <Ionicons
                    name={isVideo ? "videocam-outline" : "call-outline"}
                    size={20}
                    color={WA_GREEN}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        minWidth: 200,
        paddingVertical: 4,
    },
    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
    },
    info: {
        flex: 1,
        gap: 3,
    },
    callType: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111B21",
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "500",
    },
    callbackBtn: {
        padding: 8,
        flexShrink: 0,
    },
});
