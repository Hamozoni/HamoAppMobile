import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { AntDesign, Feather, FontAwesome6 } from "@expo/vector-icons";
import { RoundedBtn } from "../../../components/ui/roundedBtn";
import { useRouter } from "expo-router";

export default function CameraScreen() {

    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef(null);
    const [uri, setUri] = useState(null);
    const [mode, setMode] = useState("picture");
    const [facing, setFacing] = useState("back");
    const [recording, setRecording] = useState(false);
    const router = useRouter();

    if (!permission) {
        return null;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>
                    We need your permission to use the camera
                </Text>
                <Button onPress={requestPermission} title="Grant permission" />
            </View>
        );
    }

    const takePicture = async () => {
        const photo = await ref.current?.takePictureAsync();
        if (photo?.uri) setUri(photo.uri);
    };

    const recordVideo = async () => {
        if (recording) {
            setRecording(false);
            ref.current?.stopRecording();
            return;
        }
        setRecording(true);
        const video = await ref.current?.recordAsync();
        console.log({ video });
    };

    const toggleMode = () => {
        setMode((prev) => (prev === "picture" ? "video" : "picture"));
    };

    const renderPicture = (uri) => {
        return (
            <View>
                <Image
                    source={{ uri }}
                    contentFit="contain"
                    style={{ width: 300, aspectRatio: 1 }}
                />
                <Button onPress={() => setUri(null)} title="Take another picture" />
            </View>
        );
    };

    const renderCamera = () => {
        return (
            <View style={styles.cameraContainer}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", position: "absolute", top: 40, left: 0, right: 0, height: 50, zIndex: 1, paddingHorizontal: 20 }}>
                    <RoundedBtn iconName="close" large={true} onPress={() => router.back()} />
                    {
                        mode === "video" && (
                            <View style={{ backgroundColor: "#a09494ff", padding: 10, paddingHorizontal: 20, borderRadius: 20, alignItems: "center" }}>
                                <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>00:00</Text>
                            </View>
                        )
                    }
                    <RoundedBtn iconName="flash" large={true} />
                </View>
                <CameraView
                    style={styles.camera}
                    ref={ref}
                    mode={mode}
                    facing={facing}
                    mute={false}
                    responsiveOrientationWhenOrientationLocked
                />
                <View style={styles.shutterContainer}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "space-around" }}>
                        <RoundedBtn iconName="image" large={true} />
                        <RoundedBtn iconName="color-wand" />
                        <Pressable onPress={mode === "picture" ? takePicture : recordVideo}>
                            {({ pressed }) => (
                                <View
                                    style={[
                                        styles.shutterBtn,
                                        {
                                            opacity: pressed ? 0.5 : 1,
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.shutterBtnInner,
                                            {
                                                backgroundColor: mode === "picture" ? "white" : "red",
                                            },
                                        ]}
                                    />
                                </View>
                            )}
                        </Pressable>


                        <TouchableOpacity style={{ backgroundColor: "#ffffffff", padding: 10, borderRadius: "50%", alignItems: "center" }}>
                            <Text>1 ×</Text>
                        </TouchableOpacity>
                        <RoundedBtn iconName="camera-reverse-outline" large={true} onPress={() => setFacing(facing === "back" ? "front" : "back")} />


                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", width: "100%", gap: 10, justifyContent: "center", backgroundColor: "#00000071", padding: 10, borderRadius: 20, marginTop: 10 }}>
                        <TouchableOpacity onPress={() => setMode("picture")}>
                            <Text style={{ color: mode === "picture" ? "#329b13ff" : "white", fontWeight: "bold" }}>Picture</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setMode("video")}>
                            <Text style={{ color: mode === "video" ? "#329b13ff" : "white", fontWeight: "bold" }}>Video</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {uri ? renderPicture(uri) : renderCamera()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    cameraContainer: StyleSheet.absoluteFillObject,
    camera: StyleSheet.absoluteFillObject,
    shutterContainer: {
        position: "absolute",
        bottom: 44,
        left: 0,
        width: "100%",
        paddingHorizontal: 30,
    },
    shutterBtn: {
        backgroundColor: "transparent",
        borderWidth: 5,
        borderColor: "white",
        width: 85,
        height: 85,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
    },
    shutterBtnInner: {
        width: 70,
        height: 70,
        borderRadius: 50,
    },
});
