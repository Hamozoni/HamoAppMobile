import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Ionicons } from "@expo/vector-icons";
import MessageStatusBubble from "./messageStatusBubble";
import { ILocalMessage } from "../../../types/message.types";
import { formatTime } from "../../../utils/formatTime";

const WA_GREEN = "#25D366";

interface AudioMessageBubbleProps {
    message: ILocalMessage;
    isMine: boolean;
}

export default function AudioMessageBubble({ message, isMine }: AudioMessageBubbleProps) {
    const player = useAudioPlayer(message?.file?.secureUrl ?? "");
    const status = useAudioPlayerStatus(player); // ✅ reactive status

    const isPlaying = status.playing;
    const duration = status.duration ?? 0;
    const current = status.currentTime ?? 0;

    const togglePlay = () => {
        if (isPlaying) {
            player.pause();
        } else {
            player.play();
        }
    };

    const onSeek = (val: number) => {
        player.seekTo(val);
        if (!isPlaying) player.play();
    };

    const textColor = isMine ? "#fff" : "#111B21";
    const trackColor = isMine ? "rgba(255,255,255,0.9)" : WA_GREEN;
    const trackBg = isMine ? "rgba(255,255,255,0.3)" : "#DFE5E7";

    return (
        <View style={styles.container}>
            {/* Avatar */}
            <Image
                source={{ uri: (message?.senderId as any)?.profilePicture?.secureUrl }}
                style={styles.avatar}
            />

            <View style={styles.content}>
                {/* Play + Slider */}
                <View style={styles.row}>
                    <TouchableOpacity onPress={togglePlay} hitSlop={8}>
                        <Ionicons
                            name={isPlaying ? "pause" : "play"}
                            size={28}
                            color={textColor}
                        />
                    </TouchableOpacity>

                    <View style={styles.sliderWrap}>
                        <Slider
                            minimumValue={0}
                            maximumValue={duration || 1}
                            value={current}                          // ✅ reactive
                            onSlidingComplete={onSeek}
                            minimumTrackTintColor={trackColor}
                            maximumTrackTintColor={trackBg}
                            thumbTintColor={trackColor}
                            step={0.1}                               // ✅ smoother
                            style={styles.slider}
                        />
                    </View>
                </View>

                {/* Time + Status */}
                <View style={styles.footer}>
                    <Text style={[styles.time, { color: textColor }]}>
                        {/* ✅ show remaining time when playing, total when paused */}
                        {isPlaying
                            ? formatTime(Math.floor(duration - current))
                            : formatTime(Math.floor(duration))
                        }
                    </Text>
                    <MessageStatusBubble message={message} isMine={isMine} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 10,
        minWidth: 200,
        alignItems: "center",
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        flexShrink: 0,
    },
    content: {
        flex: 1,
        gap: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    sliderWrap: {
        flex: 1,
    },
    slider: {
        height: 30,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    time: {
        fontSize: 11,
        fontWeight: "600",
    },
});