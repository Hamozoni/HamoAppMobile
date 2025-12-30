import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { RoundedBtn } from "../../ui/roundedBtn";

import {
    useAudioRecirder,
    useAudioPlayerStatus,
    useAudioPlayerState,
    useAudioRecorderStatus,
    createAudioPlayer,
    AudioPlayerStatus,
    setAudioModeAsync,
    RecordingPresets,
    AudioModule,
    useAudioRecorder

} from "expo-audio"

export default function AudioRecorder({ setIsAudioRecorder }) {

    // Recording state
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY, {
        onRecordingStatusUpdate: (status) => {
            console.log(status);
        }
    });
    const recorderState = useAudioRecorderStatus(audioRecorder);

    // Playback state for recorded audio

    const [playbackPlayer, setPlaybackPlayer] = useState(null);
    const [playbackStatus, setPlaybackStatus] = useState(null);

    //  UI state
    const [recordingUri, setRecordingUri] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [recordTime, setRecordTime] = useState(0);

    const timerRef = useRef(null);

    // Audio players for sound effects (using createAudioPlayer for manual management)
    const soundEffectPlayerRef = useRef(null);
    // Initialize audio mode and permissions

    useEffect(() => {
        (
            async () => {
                // Request recording permissions

                const { granted } = await AudioModule.requestPermissionsAsync();
                if (!granted) {
                    Alert.alert('Permission to access microphone was denied');
                }
                // Configure audio mode for recording and playback
                await setAudioModeAsync({

                    playsInSilentMode: true,
                    allowsRecording: true,
                    staysActiveInBackground: true,
                    shouldDuckAndroid: true,
                    shouldDuckIOS: true,

                })
            }
        )();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            if (playbackPlayer) {
                playbackPlayer.release();
            };

            if (soundEffectPlayerRef.current) {
                soundEffectPlayerRef.current.release();
            }
        }
    }, []);
    // Timer for recording
    useEffect(() => {
        if (recorderState.isRecording) {
            timerRef.current = setInterval(() => {
                setRecordTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        };

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [recorderState.isRecording]);

    // Load and play a sound effect using expo-audio

    const playsoundEffect = useCallback(async (source) => {
        try {
            // Release previous sound effect if exists

            if (soundEffectPlayerRef.current) {
                soundEffectPlayerRef.current.release();
            };

            // Create a new audio player for the sound effect

            const player = createAudioPlayer(source);
            soundEffectPlayerRef.current = player;

            // Play the sound

            await player.play();

            // Automatically release when done

            player.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    player.release();
                    soundEffectPlayerRef.current = null;
                }
            })
        } catch (error) {
            console.error('Failed to play sound effect', error);
        }
    }, []);

    // Start recording

    const startRecording = useCallback(async () => {
        try {
            setRecordTime(0);
            await audioRecorder.prepareToRecordAsync();
            audioRecorder.startRecording();
        } catch (error) {
            console.error('Failed to start recording', error);
        }
    }, []);

    // Stop recording

    const stopRecording = async () => {
        try {
            await audioRecorder.stopRecording();

            const uri = audioRecorder.uri;
            setRecordingUri(uri);

            // if(onRecordingCompleted){
            //     onRecordingCompleted(uri);
            // }
        } catch (error) {
            console.error('Failed to stop recording', error);
        }
    };




    return (
        <View style={{ padding: 20, position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 999, backgroundColor: "#fff" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                <Text>{timer}</Text>
                <View>

                </View>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="timer-alert-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
                <RoundedBtn
                    iconName="trash-outline"
                    size={28}
                    color="red"
                    styles={{ padding: 0 }}
                />
                {
                    isRecording ?
                        <RoundedBtn
                            iconName="pause-outline"
                            size={24}
                            color="red"
                            styles={{ borderColor: "red", borderWidth: 2, padding: 3 }}
                            onPress={() => setIsRecording(false)}
                        /> :
                        <RoundedBtn
                            iconName="mic-outline"
                            size={34}
                            styles={{ padding: 0 }}
                            color="red"
                            onPress={() => setIsRecording(true)}
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