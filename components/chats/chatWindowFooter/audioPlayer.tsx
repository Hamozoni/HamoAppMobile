// import React, { useEffect, useState } from "react";
// import { useAudioPlayer } from "expo-audio";
// import { TouchableOpacity, Text, View } from "react-native";
// import { formatTime } from "../../../utils/formatTime";
// import Slider from "@react-native-community/slider";
// import { Ionicons } from "@expo/vector-icons";

// interface AudioPlayerProps {
//     uri: string;
// }

// export default function AudioPlayer({ uri }: AudioPlayerProps) {
//     const player = useAudioPlayer(uri);
//     const [isPlaying, setIsPlaying] = useState(false);

//     const togglePlay = () => {
//         if (isPlaying) {
//             player?.pause();
//             setIsPlaying(false);
//         } else {
//             player?.play();
//             setIsPlaying(true);
//         }
//     };

//     const onSeek = (val: number) => {
//         player?.seekTo(val);
//         player?.play();
//     };

//     useEffect(() => {
//         return () => {
//             if (isPlaying) {
//                 player?.pause();
//             }
//         };
//     }, [isPlaying, player]);

//     if (!player) return null;

//     return (
//         <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
//             <TouchableOpacity onPress={togglePlay}>
//                 {
//                     isPlaying ?
//                         <Ionicons name="pause" size={24} color="black" />
//                         : <Ionicons name="play" size={24} color="black" />
//                 }
//             </TouchableOpacity>
//             <View style={{ flex: 1 }}>
//                 <Slider
//                     minimumValue={0}
//                     maximumValue={player.duration}
//                     value={player.currentTime}
//                     onSlidingComplete={onSeek}
//                     minimumTrackTintColor="#FFFFFF"
//                     maximumTrackTintColor="#252121ff"
//                     thumbTintColor="#e6dcdcff"
//                     step={1}
//                 />
//             </View>
//             <Text>{formatTime(Math.floor(player.currentTime))}</Text>
//         </View>
//     );
// }

import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useAudioPlayer } from "expo-audio";
import { formatTime } from "../../../utils/formatTime";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";

const WA_GREEN = "#25D366";

interface AudioPlayerProps {
    uri: string;
    dark?: boolean; // true when inside a sent message bubble
}

export default function AudioPlayer({ uri, dark = false }: AudioPlayerProps) {
    const player = useAudioPlayer(uri);
    const [isPlaying, setIsPlaying] = useState(false);

    // ✅ Fixed: cleanup only pauses if actually playing
    useEffect(() => {
        return () => {
            try { player?.pause(); } catch (_) { }
        };
    }, [player]);

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
        setIsPlaying(true);
    };

    const textColor = dark ? "#fff" : "#111B21";
    const trackColor = dark ? "rgba(255,255,255,0.9)" : WA_GREEN;
    const trackBg = dark ? "rgba(255,255,255,0.3)" : "#DFE5E7";
    const thumb = dark ? "rgba(255,255,255,0.9)" : WA_GREEN;

    if (!player) return null;

    const elapsed = Math.floor(player.currentTime);
    const duration = Math.floor(player.duration);

    return (
        <View style={styles.row}>
            <TouchableOpacity onPress={togglePlay} style={styles.playBtn} hitSlop={8}>
                <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={20}
                    color={textColor}
                />
            </TouchableOpacity>

            <View style={styles.sliderWrap}>
                <Slider
                    minimumValue={0}
                    maximumValue={duration || 1}
                    value={elapsed}
                    onSlidingComplete={onSeek}
                    minimumTrackTintColor={trackColor}
                    maximumTrackTintColor={trackBg}
                    thumbTintColor={thumb}
                    step={1}
                    style={styles.slider}
                />
            </View>

            {/* ✅ Fixed: show formatted time */}
            <Text style={[styles.time, { color: dark ? "rgba(255,255,255,0.8)" : "#667781" }]}>
                {isPlaying ? formatTime(elapsed) : formatTime(duration)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    playBtn: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
    },
    sliderWrap: {
        flex: 1,
    },
    slider: {
        height: 30,
    },
    time: {
        fontSize: 11,
        fontWeight: "600",
        minWidth: 34,
        textAlign: "right",
        flexShrink: 0,
    },
});
