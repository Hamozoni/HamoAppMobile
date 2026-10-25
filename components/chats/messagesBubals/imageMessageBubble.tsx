import React, { useMemo, useState } from "react";
import { TouchableOpacity, View, ActivityIndicator, StyleSheet, useWindowDimensions } from "react-native";
import { Image } from "expo-image"; // npx expo install expo-image
import { useRouter } from "expo-router";
import { ILocalMessage } from "../../../types/message.types";

interface ImageMessageBubbleProps {
    message: ILocalMessage;
    isMine: boolean;
}

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 360;
const DEFAULT_RATIO = 4 / 3; // used when metadata is missing

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export default function ImageMessageBubble({ message, isMine }: ImageMessageBubbleProps) {
    const router = useRouter();
    const { width: screenWidth } = useWindowDimensions();
    const [loading, setLoading] = useState(true);

    const file = message?.file;

    const { displayWidth, displayHeight } = useMemo(() => {
        const w = Number(file?.metadata?.width);
        const h = Number(file?.metadata?.height);
        const ratio = w > 0 && h > 0 ? w / h : DEFAULT_RATIO;

        // WhatsApp: fixed bubble width, height follows aspect ratio within limits
        const displayWidth = Math.min(screenWidth * 0.65, 300);
        const displayHeight = clamp(displayWidth / ratio, MIN_HEIGHT, MAX_HEIGHT);

        return { displayWidth, displayHeight };
    }, [file?.metadata?.width, file?.metadata?.height, screenWidth]);

    // Small image in the chat list, full image in the gallery
    const uri = file?.thumbnailUrl || file?.secureUrl;
    if (!uri) return null;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
                router.push({
                    pathname: "/chatWindow/mediaGallery" as any,
                    params: { id: file?._id, messageId: message?._id },
                })
            }
        >
            <View style={[styles.container, { width: displayWidth, height: displayHeight }]}>
                <Image
                    source={{ uri }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover" // crops tall/wide images like WhatsApp
                    transition={200}
                    cachePolicy="memory-disk"
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                />
                {loading && (
                    <View style={styles.loader}>
                        <ActivityIndicator />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "rgba(128,128,128,0.2)", // placeholder while loading
    },
    loader: {
        ...StyleSheet.absoluteFill,
        alignItems: "center",
        justifyContent: "center",
    },
});
