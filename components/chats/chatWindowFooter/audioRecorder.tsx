// import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
// import { View, Text, Alert } from "react-native";
// import { RoundedBtn } from "../../buttons/roundedBtn";
// import {
//     useAudioRecorder,
//     AudioModule,
//     RecordingPresets,
//     setAudioModeAsync,
//     useAudioRecorderState,
// } from 'expo-audio';
// import { FlatList } from "react-native-gesture-handler";
// import { formatTime } from "../../../utils/formatTime";
// import AudioPlayer from "./audioPlayer";

// interface AudioRecorderProps {
//     setIsAudioRecorder: (value: boolean) => void;
// }

// export default function AudioRecorder({ setIsAudioRecorder }: AudioRecorderProps) {
//     const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
//     const recorderState = useAudioRecorderState(audioRecorder);
//     const [recordUri, setRecordUri] = useState<string | null>(null);
//     const [wave, setWave] = useState<number[]>([]);
//     const [recordTime, setRecordTime] = useState(0);
//     const timerRef = useRef<NodeJS.Timeout | null>(null);
//     const waveRef = useRef<NodeJS.Timeout | null>(null);
//     const flatListRef = useRef<FlatList<number>>(null);

//     const startRecording = async () => {
//         await audioRecorder.prepareToRecordAsync();
//         audioRecorder.record();
//         timerRef.current = setInterval(() => {
//             setRecordTime(prev => prev + 1);
//         }, 1000);
//         waveRef.current = setInterval(() => {
//             setWave(prev => [...prev, Math.floor(Math.random() * 25)]);
//         }, 100);
//     };

//     const clearWaveAndTimer = () => {
//         if (timerRef.current) {
//             clearInterval(timerRef.current);
//         }
//         if (waveRef.current) {
//             clearInterval(waveRef.current);
//         }
//     };

//     const stopRecording = async () => {
//         await audioRecorder?.stop();
//         if (audioRecorder.uri) {
//             setRecordUri(audioRecorder.uri);
//         }
//         clearWaveAndTimer();
//     };

//     useEffect(() => {
//         (async () => {
//             const status = await AudioModule.requestRecordingPermissionsAsync();
//             if (!status.granted) {
//                 Alert.alert('Permission to access microphone was denied');
//             }

//             setAudioModeAsync({
//                 playsInSilentMode: true,
//                 allowsRecording: true,
//             });
//             startRecording();
//         })();

//         return () => clearWaveAndTimer();
//     }, []);

//     useLayoutEffect(() => {
//         if (wave.length > 0 && flatListRef.current) {
//             flatListRef.current.scrollToEnd({ animated: true });
//         }
//     }, [wave]);

//     return (
//         <View style={{ padding: 20, position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 999, backgroundColor: "#fff" }}>
//             <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
//                 {
//                     (!recorderState.isRecording && recordUri) ?
//                         <AudioPlayer uri={recordUri} />
//                         :
//                         <>
//                             <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>{formatTime(recordTime)}</Text>
//                             <FlatList
//                                 horizontal
//                                 data={wave}
//                                 contentContainerStyle={{ gap: 0.3, height: 30 }}
//                                 keyExtractor={(_, index) => index.toString()}
//                                 showsHorizontalScrollIndicator={false}
//                                 ref={flatListRef}
//                                 renderItem={({ item }) => (
//                                     <View style={{ height: item, width: 2, backgroundColor: "#ccc", alignSelf: "center" }} />
//                                 )}
//                             />
//                         </>
//                 }
//             </View>
//             <View style={{ flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
//                 <RoundedBtn
//                     iconName="trash-outline"
//                     size={28}
//                     color="red"
//                     styles={{ padding: 0 }}
//                 />
//                 {
//                     recorderState.isRecording ?
//                         <RoundedBtn
//                             iconName="pause-outline"
//                             size={24}
//                             color="red"
//                             styles={{ borderColor: "red", borderWidth: 2, padding: 3 }}
//                             onPress={stopRecording}
//                         /> :
//                         <RoundedBtn
//                             iconName="mic-outline"
//                             size={34}
//                             styles={{ padding: 0 }}
//                             color="red"
//                             onPress={startRecording}
//                         />
//                 }
//                 <RoundedBtn
//                     iconName="send"
//                     size={20}
//                     color="white"
//                     styles={{ backgroundColor: "#1fa105" }}
//                     onPress={() => setIsAudioRecorder(false)}
//                 />
//             </View>
//         </View>
//     );
// }

import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
    useAudioRecorder, AudioModule,
    RecordingPresets, setAudioModeAsync,
    useAudioRecorderState,
} from "expo-audio";
import { FlatList } from "react-native-gesture-handler";
import { formatTime } from "../../../utils/formatTime";
import AudioPlayer from "./audioPlayer";
import { Ionicons } from "@expo/vector-icons";

const WA_GREEN = "#25D366";
const MISSED_RED = "#FF3B30";

interface AudioRecorderProps {
    setIsAudioRecorder: (value: boolean) => void;
}

export default function AudioRecorder({ setIsAudioRecorder }: AudioRecorderProps) {
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(audioRecorder);
    const [recordUri, setRecordUri] = useState<string | null>(null);
    const [wave, setWave] = useState<number[]>([]);
    const [recordTime, setRecordTime] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const waveRef = useRef<NodeJS.Timeout | null>(null);
    const flatListRef = useRef<FlatList<number>>(null);
    const hasStarted = useRef(false); // ✅ fix: prevent double-start

    const clearIntervals = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (waveRef.current) clearInterval(waveRef.current);
    };

    const startRecording = async () => {
        if (hasStarted.current) return; // ✅ guard
        hasStarted.current = true;
        setWave([]);
        setRecordTime(0);
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
        timerRef.current = setInterval(() => setRecordTime(p => p + 1), 1000);
        waveRef.current = setInterval(() => {
            setWave(prev => [...prev, Math.floor(Math.random() * 28) + 4]);
        }, 100);
    };

    const stopRecording = async () => {
        await audioRecorder.stop();
        if (audioRecorder.uri) setRecordUri(audioRecorder.uri);
        clearIntervals();
        hasStarted.current = false;
    };

    const discard = async () => {
        if (recorderState.isRecording) await audioRecorder.stop();
        clearIntervals();
        setIsAudioRecorder(false);
    };

    useEffect(() => {
        (async () => {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
                Alert.alert("Permission denied", "Please allow microphone access.");
                setIsAudioRecorder(false);
                return;
            }
            await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
            await startRecording();
        })();
        return () => clearIntervals();
    }, []);

    useLayoutEffect(() => {
        if (wave.length > 0 && flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: false });
        }
    }, [wave]);

    const isRecording = recorderState.isRecording;

    return (
        <View style={styles.container}>
            {/* ── Waveform / player ── */}
            <View style={styles.visualRow}>
                {!isRecording && recordUri ? (
                    <AudioPlayer uri={recordUri} />
                ) : (
                    <>
                        <Text style={styles.timer}>{formatTime(recordTime)}</Text>
                        <View style={styles.waveWrap}>
                            <FlatList
                                ref={flatListRef}
                                horizontal
                                data={wave}
                                keyExtractor={(_, i) => i.toString()}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.waveContent}
                                renderItem={({ item }) => (
                                    <View style={[styles.waveBar, { height: item }]} />
                                )}
                            />
                        </View>
                        {/* Live pulse dot */}
                        <View style={styles.liveDot} />
                    </>
                )}
            </View>

            {/* ── Controls ── */}
            <View style={styles.controls}>
                {/* Discard */}
                <TouchableOpacity onPress={discard} style={styles.controlBtn} hitSlop={8}>
                    <Ionicons name="trash-outline" size={24} color={MISSED_RED} />
                </TouchableOpacity>

                {/* Stop / Re-record */}
                {isRecording ? (
                    <TouchableOpacity
                        onPress={stopRecording}
                        style={[styles.controlBtn, styles.recordBtn]}
                        hitSlop={8}
                    >
                        <View style={styles.stopSquare} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={startRecording}
                        style={[styles.controlBtn, styles.recordBtn]}
                        hitSlop={8}
                    >
                        <Ionicons name="mic" size={24} color="#fff" />
                    </TouchableOpacity>
                )}

                {/* Send */}
                <TouchableOpacity
                    onPress={() => setIsAudioRecorder(false)}
                    style={[styles.controlBtn, styles.sendBtn]}
                    disabled={!recordUri}
                    hitSlop={8}
                >
                    <Ionicons
                        name="send"
                        size={20}
                        color={recordUri ? "#fff" : "#9DB2BF"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#E5E7EB",
        gap: 12,
    },
    visualRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        height: 40,
    },
    timer: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111B21",
        minWidth: 42,
    },
    waveWrap: {
        flex: 1,
        height: 40,
        overflow: "hidden",
    },
    waveContent: {
        alignItems: "center",
        gap: 2,
        paddingHorizontal: 4,
    },
    waveBar: {
        width: 2.5,
        borderRadius: 2,
        backgroundColor: WA_GREEN,
        alignSelf: "center",
    },
    liveDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#FF3B30",
        flexShrink: 0,
    },
    controls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    controlBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    recordBtn: {
        backgroundColor: "#FF3B30",
    },
    stopSquare: {
        width: 14,
        height: 14,
        borderRadius: 3,
        backgroundColor: "#fff",
    },
    sendBtn: {
        backgroundColor: WA_GREEN,
        shadowColor: WA_GREEN,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 4,
    },
});