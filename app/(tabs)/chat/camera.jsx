import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Pressable,
    Dimensions,
    Animated,
    ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Video } from "expo-video";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const router = useRouter();

    // Camera states
    const [facing, setFacing] = useState("back");
    const [flash, setFlash] = useState("off");
    const [mode, setMode] = useState("picture"); // picture or video
    const [zoom, setZoom] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    // Media preview states
    const [capturedMedia, setCapturedMedia] = useState(null);
    const [mediaType, setMediaType] = useState(null); // 'photo' or 'video'
    const [isProcessing, setIsProcessing] = useState(false);

    // Animation for recording indicator
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const recordingTimer = useRef(null);

    useEffect(() => {
        if (isRecording) {
            // Start pulse animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Start timer
            recordingTimer.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } else {
            pulseAnim.stopAnimation();
            pulseAnim.setValue(1);
            if (recordingTimer.current) {
                clearInterval(recordingTimer.current);
                recordingTimer.current = null;
            }
            setRecordingTime(0);
        }

        return () => {
            if (recordingTimer.current) {
                clearInterval(recordingTimer.current);
            }
        };
    }, [isRecording]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Permission handling
    if (!permission) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#25D366" />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <View style={styles.permissionContent}>
                    <Ionicons name="camera-outline" size={80} color="#259cd3" />
                    <Text style={styles.permissionTitle}>Camera Access Required</Text>
                    <Text style={styles.permissionText}>
                        We need your permission to use the camera for taking photos and recording videos.
                    </Text>
                    <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                        <Text style={styles.permissionButtonText}>Grant Permission</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Camera functions
    const takePicture = async () => {
        if (!cameraRef.current || isProcessing) return;

        setIsProcessing(true);
        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.9,
                skipProcessing: false,
            });
            setCapturedMedia(photo.uri);
            setMediaType("photo");
        } catch (error) {
            console.error("Error taking picture:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const startRecording = async () => {
        if (!cameraRef.current || isRecording) return;

        setIsRecording(true);
        try {
            const video = await cameraRef.current.recordAsync({
                maxDuration: 60,
                quality: "1080p",
            });
            setCapturedMedia(video.uri);
            setMediaType("video");
        } catch (error) {
            console.error("Error recording video:", error);
        }
    };

    const stopRecording = () => {
        if (cameraRef.current && isRecording) {
            cameraRef.current.stopRecording();
            setIsRecording(false);
        }
    };

    const toggleFacing = () => {
        setFacing((prev) => (prev === "back" ? "front" : "back"));
    };

    const toggleFlash = () => {
        const modes = ["off", "on", "auto"];
        const currentIndex = modes.indexOf(flash);
        setFlash(modes[(currentIndex + 1) % modes.length]);
    };

    const getFlashIcon = () => {
        switch (flash) {
            case "on":
                return "flash";
            case "auto":
                return "flash-outline";
            default:
                return "flash-off";
        }
    };

    const handleShutterPress = () => {
        if (mode === "picture") {
            takePicture();
        } else {
            if (isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        }
    };

    const handleZoom = (scale) => {
        const newZoom = Math.min(Math.max(zoom + (scale - 1) * 0.1, 0), 1);
        setZoom(newZoom);
    };

    const retakeMedia = () => {
        setCapturedMedia(null);
        setMediaType(null);
    };

    const sendMedia = () => {
        // Here you would handle sending the media
        console.log("Sending media:", capturedMedia);
        router.back();
    };

    // Pinch gesture for zoom
    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            handleZoom(event.scale);
        });

    // Render media preview with edit options
    const renderMediaPreview = () => (
        <View style={styles.previewContainer}>
            {mediaType === "photo" ? (
                <Image
                    source={{ uri: capturedMedia }}
                    style={styles.previewMedia}
                    contentFit="contain"
                />
            ) : (
                <Video
                    source={{ uri: capturedMedia }}
                    style={styles.previewMedia}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                    shouldPlay
                />
            )}

            {/* Top Controls */}
            <View style={styles.previewTopControls}>
                <TouchableOpacity style={styles.previewIconButton} onPress={retakeMedia}>
                    <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
                <View style={styles.editOptions}>
                    <TouchableOpacity style={styles.editButton}>
                        <Ionicons name="crop" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editButton}>
                        <Ionicons name="color-filter" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editButton}>
                        <MaterialIcons name="emoji-emotions" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editButton}>
                        <Ionicons name="text" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editButton}>
                        <Ionicons name="pencil" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom Controls */}
            <View style={styles.previewBottomControls}>
                <TouchableOpacity style={styles.retakeButton} onPress={retakeMedia}>
                    <Ionicons name="refresh" size={24} color="#fff" />
                    <Text style={styles.retakeText}>Retake</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sendButton} onPress={sendMedia}>
                    <Ionicons name="send" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // Render camera view
    const renderCamera = () => (
        <GestureHandlerRootView style={styles.cameraWrapper}>
            <GestureDetector gesture={pinchGesture}>
                <View style={styles.cameraContainer}>
                    <CameraView
                        ref={cameraRef}
                        style={styles.camera}
                        facing={facing}
                        flash={flash}
                        mode={mode}
                        zoom={zoom}
                        mute={false}
                    />

                    {/* Top Controls */}
                    <View style={styles.topControls}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                            <Ionicons name="close" size={30} color="#fff" />
                        </TouchableOpacity>

                        {isRecording && (
                            <View style={styles.recordingIndicator}>
                                <Animated.View
                                    style={[
                                        styles.recordingDot,
                                        { transform: [{ scale: pulseAnim }] },
                                    ]}
                                />
                                <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
                            </View>
                        )}

                        <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
                            <Ionicons name={getFlashIcon()} size={26} color="#fff" />
                            {flash === "auto" && (
                                <Text style={styles.flashAutoText}>A</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Zoom Indicator */}
                    {zoom > 0 && (
                        <View style={styles.zoomIndicator}>
                            <Text style={styles.zoomText}>{(1 + zoom * 4).toFixed(1)}×</Text>
                        </View>
                    )}

                    {/* Bottom Controls */}
                    <View style={styles.bottomControls}>
                        {/* Gallery Button */}
                        <TouchableOpacity style={styles.galleryButton}>
                            <Ionicons name="images" size={28} color="#fff" />
                        </TouchableOpacity>

                        {/* Zoom Controls */}
                        <View style={styles.zoomControls}>
                            {[0, 0.25, 0.5].map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    style={[
                                        styles.zoomButton,
                                        Math.abs(zoom - level) < 0.1 && styles.zoomButtonActive,
                                    ]}
                                    onPress={() => setZoom(level)}
                                >
                                    <Text
                                        style={[
                                            styles.zoomButtonText,
                                            Math.abs(zoom - level) < 0.1 && styles.zoomButtonTextActive,
                                        ]}
                                    >
                                        {level === 0 ? "1×" : level === 0.25 ? "2×" : "3×"}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Shutter Button */}
                        <Pressable
                            onPress={handleShutterPress}
                            onLongPress={mode === "video" ? startRecording : undefined}
                            disabled={isProcessing}
                        >
                            {({ pressed }) => (
                                <View
                                    style={[
                                        styles.shutterButton,
                                        pressed && styles.shutterButtonPressed,
                                        isRecording && styles.shutterButtonRecording,
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.shutterInner,
                                            mode === "video" && !isRecording && styles.shutterInnerVideo,
                                            isRecording && styles.shutterInnerRecording,
                                        ]}
                                    />
                                </View>
                            )}
                        </Pressable>

                        {/* Flip Camera Button */}
                        <TouchableOpacity style={styles.flipButton} onPress={toggleFacing}>
                            <Ionicons name="camera-reverse" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Mode Selector */}
                    <View style={styles.modeSelector}>
                        <TouchableOpacity
                            style={[styles.modeButton, mode === "picture" && styles.modeButtonActive]}
                            onPress={() => setMode("picture")}
                        >
                            <Text style={[styles.modeText, mode === "picture" && styles.modeTextActive]}>
                                Photo
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modeButton, mode === "video" && styles.modeButtonActive]}
                            onPress={() => setMode("video")}
                        >
                            <Text style={[styles.modeText, mode === "video" && styles.modeTextActive]}>
                                Video
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Processing Overlay */}
                    {isProcessing && (
                        <View style={styles.processingOverlay}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    )}
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    );

    return (
        <View style={styles.container}>
            {capturedMedia ? renderMediaPreview() : renderCamera()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },
    permissionContent: {
        alignItems: "center",
    },
    permissionTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#fff",
        marginTop: 20,
        marginBottom: 10,
    },
    permissionText: {
        fontSize: 16,
        color: "#aaa",
        textAlign: "center",
        marginBottom: 30,
        lineHeight: 24,
    },
    permissionButton: {
        backgroundColor: "#259cd3",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 15,
    },
    permissionButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        color: "#888",
        fontSize: 16,
    },
    cameraWrapper: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    topControls: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        zIndex: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    flashAutoText: {
        position: "absolute",
        bottom: 5,
        right: 8,
        fontSize: 10,
        fontWeight: "bold",
        color: "#fff",
    },
    recordingIndicator: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 8,
    },
    recordingDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#ff3b30",
    },
    recordingTime: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    zoomIndicator: {
        position: "absolute",
        top: "45%",
        alignSelf: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    zoomText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    bottomControls: {
        position: "absolute",
        bottom: 140,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
    },
    galleryButton: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    zoomControls: {
        position: "absolute",
        top: -60,
        flexDirection: "row",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 20,
        padding: 4,
    },
    zoomButton: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 16,
    },
    zoomButtonActive: {
        backgroundColor: "#fff",
    },
    zoomButtonText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },
    zoomButtonTextActive: {
        color: "#000",
    },
    shutterButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    shutterButtonPressed: {
        opacity: 0.7,
    },
    shutterButtonRecording: {
        borderColor: "#ff3b30",
    },
    shutterInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#fff",
    },
    shutterInnerVideo: {
        backgroundColor: "#ff3b30",
    },
    shutterInnerRecording: {
        width: 30,
        height: 30,
        borderRadius: 6,
        backgroundColor: "#ff3b30",
    },
    flipButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    modeSelector: {
        position: "absolute",
        bottom: 80,
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 25,
        padding: 4,
    },
    modeButton: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
    },
    modeButtonActive: {
        backgroundColor: "#259cd3",
    },
    modeText: {
        color: "#aaa",
        fontSize: 15,
        fontWeight: "600",
    },
    modeTextActive: {
        color: "#fff",
    },
    processingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    // Preview styles
    previewContainer: {
        flex: 1,
        backgroundColor: "#000",
    },
    previewMedia: {
        flex: 1,
        width: SCREEN_WIDTH,
    },
    previewTopControls: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingHorizontal: 15,
    },
    previewIconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    editOptions: {
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 25,
        padding: 8,
        gap: 5,
    },
    editButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    previewBottomControls: {
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    retakeButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        gap: 8,
    },
    retakeText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    sendButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#259cd3",
        justifyContent: "center",
        alignItems: "center",
    },
});
