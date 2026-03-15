import React, { useState } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet,
    Modal, Linking, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ILocalMessage } from "../../../types/message.types";
import MapView, { Marker } from "react-native-maps";

interface LocationMessageBubbleProps {
    message: ILocalMessage;
    isMine: boolean;
}

interface MapApp {
    name: string;
    icon: string;
    url: string;
}

export default function LocationMessageBubble({ message, isMine }: LocationMessageBubbleProps) {
    const [showPicker, setShowPicker] = useState(false);

    const { latitude, longitude, name } = message?.location ?? {};
    if (!latitude || !longitude) return null;

    // ✅ All major map apps
    const mapApps: MapApp[] = [
        {
            name: "Google Maps",
            icon: "🗺️",
            url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        },
        {
            name: "Google Maps (App)",
            icon: "📍",
            url: `comgooglemaps://?q=${latitude},${longitude}&center=${latitude},${longitude}`,
        },
        {
            name: "Apple Maps",
            icon: "🍎",
            url: `maps://?q=${latitude},${longitude}`,
        },
        {
            name: "Waze",
            icon: "🚗",
            url: `waze://?ll=${latitude},${longitude}&navigate=yes`,
        },
        {
            name: "HERE Maps",
            icon: "🧭",
            url: `here-location://v1/show/map?lat=${latitude}&lon=${longitude}`,
        },
    ];

    const openApp = async (app: MapApp) => {
        setShowPicker(false);
        try {
            const canOpen = await Linking.canOpenURL(app.url);
            if (canOpen) {
                await Linking.openURL(app.url);
            } else {
                // ✅ Fallback to Google Maps web
                await Linking.openURL(
                    `https://www.google.com/maps?q=${latitude},${longitude}`
                );
            }
        } catch {
            Alert.alert("Error", `Could not open ${app.name}`);
        }
    };

    // ✅ Filter to only installed apps
    const getAvailableApps = async () => {
        const available: MapApp[] = [
            // Web Google Maps always works
            mapApps[0],
        ];
        for (const app of mapApps.slice(1)) {
            const canOpen = await Linking.canOpenURL(app.url);
            if (canOpen) available.push(app);
        }
        return available;
    };

    const handlePress = async () => {
        const available = await getAvailableApps();
        if (available.length === 1) {
            // Only web Google Maps — open directly
            openApp(available[0]);
        } else {
            setShowPicker(true);
        }
    };

    return (
        <>
            {/* ✅ Mini MapView preview — no API key needed */}
            <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
                <View style={styles.container}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude,
                            longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        pointerEvents="none"
                    >
                        <Marker coordinate={{ latitude, longitude }} />
                    </MapView>

                    {/* Overlay label */}
                    <View style={styles.label}>
                        <Ionicons name="location" size={14} color="#25D366" />
                        <Text style={styles.labelText} numberOfLines={1}>
                            {name ?? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
                        </Text>
                        <Ionicons name="open-outline" size={12} color="#667781" />
                    </View>
                </View>
            </TouchableOpacity>

            {/* ✅ Map app picker modal */}
            <Modal
                visible={showPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPicker(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setShowPicker(false)}
                >
                    <View style={styles.sheet}>
                        <View style={styles.handle} />
                        <Text style={styles.sheetTitle}>Open in Maps</Text>

                        {mapApps.map((app, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.appRow}
                                onPress={() => openApp(app)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.appIcon}>{app.icon}</Text>
                                <Text style={styles.appName}>{app.name}</Text>
                                <Ionicons name="chevron-forward" size={18} color="#ccc" />
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => setShowPicker(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 250,
        borderRadius: 10,
        overflow: "hidden",
    },
    map: {
        width: 250,
        height: 160,
    },
    label: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        padding: 8,
        backgroundColor: "#fff",
    },
    labelText: {
        flex: 1,
        fontSize: 12,
        color: "#111B21",
        fontWeight: "500",
    },

    // ── Modal ────────────────────────────────────
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.07)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 12,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#E5E7EB",
        alignSelf: "center",
        marginBottom: 16,
    },
    sheetTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#111B21",
        marginBottom: 16,
        textAlign: "center",
    },
    appRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#F0F2F5",
        gap: 14,
    },
    appIcon: {
        fontSize: 24,
    },
    appName: {
        flex: 1,
        fontSize: 16,
        color: "#111B21",
        fontWeight: "500",
    },
    cancelBtn: {
        marginTop: 16,
        paddingVertical: 14,
        alignItems: "center",
        backgroundColor: "#F0F2F5",
        borderRadius: 12,
    },
    cancelText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FF3B30",
    },
});
