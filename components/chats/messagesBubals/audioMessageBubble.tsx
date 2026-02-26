import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import Slider from "@react-native-community/slider";
import { useAudioPlayer } from 'expo-audio';
import { Ionicons } from "@expo/vector-icons";
import MessageStatusBubble from "./messageStatusBubble";

interface Message {
    metadata?: {
        url: string;
    };
    senderId?: number;
    status?: string;
    timestamp?: string;
}

interface AudioMessageBubbleProps {
    message: Message;
}

export default function AudioMessageBubble({ message }: AudioMessageBubbleProps) {

    const player = useAudioPlayer(message?.metadata?.url || '');
    const [isPlaying, setIsPlaying] = useState(false);

    function togglePlay() {
        if (isPlaying) {
            player.pause();
            setIsPlaying(false);
        } else {
            player.play();
            setIsPlaying(true);
        }
    }

    function onSeek(val: number) {
        player.seekTo(val);
        player.play();
    }

    return (
        <View style={{ flexDirection: "row", gap: 10, minWidth: "100%" }}>
            <Image
                source={require("../../../assets/images/pexels-nati-87264186-34295251.jpg")}
                style={{ width: 40, height: 40, borderRadius: 20 }}
            />
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <TouchableOpacity onPress={togglePlay}>
                        <Ionicons name={isPlaying ? "pause" : "play"} size={30} />
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
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ color: "white" }}>
                        {Math.floor(player.duration)}s
                    </Text>
                    <MessageStatusBubble
                        message={message as any}
                    />
                </View>
            </View>
        </View>
    );
}
