import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Ionicons } from "@expo/vector-icons";
import MessageStatusBubble from "./messageStatusBubble";
import { ILocalMessage } from "../../../types/message.types";
import { formatTime } from "../../../utils/formatTime";
import { useChatsStore } from "../../../hooks/store/useChatsStore";
import WaveformSeekBar from "./waveformseekpar";

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

    const { chats } = useChatsStore();

    const findChatById = () => {
        if (!chats) return null;
        return chats.find(chat => chat._id === message?.chatId)?.participants?.find(e => e._id === message?.senderId)?.profilePicture?.secureUrl
    };

    return (
        <View style={styles.container}>
            {/* Avatar */}
            <Image
                source={{ uri: findChatById() }}
                style={styles.avatar}
            />
            <View style={styles.content}>
                {/* Play + Slider */}
                <View style={styles.row}>
                    <TouchableOpacity onPress={togglePlay} hitSlop={8}>
                        <Ionicons
                            name={isPlaying ? "pause" : "play"}
                            size={22}
                            color={textColor}
                        />
                    </TouchableOpacity>

                    <View style={styles.sliderWrap}>
                        <WaveformSeekBar
                            duration={duration}
                            current={current}
                            onSeek={onSeek}              // receives seconds, same as before
                            activeColor={trackColor}
                            inactiveColor={trackBg}
                            seed={message._id}
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
        gap: 5,
        minWidth: "88%",

    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        flexShrink: 0,
    },
    content: {
        flex: 1,
        gap: 0,
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
        height: 20,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    time: {
        fontSize: 12,
        fontWeight: "400",
    },
});


