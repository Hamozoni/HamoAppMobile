import React, { useEffect, useState } from "react";
import { useAudioPlayer } from "expo-audio";
import { TouchableOpacity, Text, View } from "react-native";
import { formatTime } from "../../../utils/formatTime";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";

interface AudioPlayerProps {
    uri: string;
}

export default function AudioPlayer({ uri }: AudioPlayerProps) {
    const player = useAudioPlayer(uri);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (isPlaying) {
            player?.pause();
            setIsPlaying(false);
        } else {
            player?.play();
            setIsPlaying(true);
        }
    };

    const onSeek = (val: number) => {
        player?.seekTo(val);
        player?.play();
    };

    useEffect(() => {
        return () => {
            if (isPlaying) {
                player?.pause();
            }
        };
    }, [isPlaying, player]);

    if (!player) return null;

    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <TouchableOpacity onPress={togglePlay}>
                {
                    isPlaying ?
                        <Ionicons name="pause" size={24} color="black" />
                        : <Ionicons name="play" size={24} color="black" />
                }
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
                <Slider
                    minimumValue={0}
                    maximumValue={player.duration}
                    value={player.currentTime}
                    onSlidingComplete={onSeek}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#252121ff"
                    thumbTintColor="#e6dcdcff"
                    step={1}
                />
            </View>
            <Text>{formatTime(Math.floor(player.currentTime))}</Text>
        </View>
    );
}
