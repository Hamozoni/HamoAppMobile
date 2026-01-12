import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { View, Text, Alert } from "react-native";
import { RoundedBtn } from "../../buttons/roundedBtn";
import {
    useAudioRecorder,
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioRecorderState,
} from 'expo-audio';
import { FlatList } from "react-native-gesture-handler";
import { formatTime } from "../../../utils/formatTime";
import AudioPlayer from "./audioPlayer";

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

    const startRecording = async () => {
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
        timerRef.current = setInterval(() => {
            setRecordTime(prev => prev + 1);
        }, 1000);
        waveRef.current = setInterval(() => {
            setWave(prev => [...prev, Math.floor(Math.random() * 25)]);
        }, 100);
    };

    const clearWaveAndTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (waveRef.current) {
            clearInterval(waveRef.current);
        }
    };

    const stopRecording = async () => {
        await audioRecorder?.stop();
        if (audioRecorder.uri) {
            setRecordUri(audioRecorder.uri);
        }
        clearWaveAndTimer();
    };

    useEffect(() => {
        (async () => {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
                Alert.alert('Permission to access microphone was denied');
            }

            setAudioModeAsync({
                playsInSilentMode: true,
                allowsRecording: true,
            });
            startRecording();
        })();

        return () => clearWaveAndTimer();
    }, []);

    useLayoutEffect(() => {
        if (wave.length > 0 && flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [wave]);

    return (
        <View style={{ padding: 20, position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 999, backgroundColor: "#fff" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                {
                    (!recorderState.isRecording && recordUri) ?
                        <AudioPlayer uri={recordUri} />
                        :
                        <>
                            <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>{formatTime(recordTime)}</Text>
                            <FlatList
                                horizontal
                                data={wave}
                                contentContainerStyle={{ gap: 0.3, height: 30 }}
                                keyExtractor={(_, index) => index.toString()}
                                showsHorizontalScrollIndicator={false}
                                ref={flatListRef}
                                renderItem={({ item }) => (
                                    <View style={{ height: item, width: 2, backgroundColor: "#ccc", alignSelf: "center" }} />
                                )}
                            />
                        </>
                }
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
                <RoundedBtn
                    iconName="trash-outline"
                    size={28}
                    color="red"
                    styles={{ padding: 0 }}
                />
                {
                    recorderState.isRecording ?
                        <RoundedBtn
                            iconName="pause-outline"
                            size={24}
                            color="red"
                            styles={{ borderColor: "red", borderWidth: 2, padding: 3 }}
                            onPress={stopRecording}
                        /> :
                        <RoundedBtn
                            iconName="mic-outline"
                            size={34}
                            styles={{ padding: 0 }}
                            color="red"
                            onPress={startRecording}
                        />
                }
                <RoundedBtn
                    iconName="send"
                    size={20}
                    color="white"
                    styles={{ backgroundColor: "#1fa105" }}
                    onPress={() => setIsAudioRecorder(false)}
                />
            </View>
        </View>
    );
}
