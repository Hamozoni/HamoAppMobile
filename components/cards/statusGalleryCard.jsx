import StatusGalleryHeader from "../status/statusGalleryHeader";
import VideoPlayer from "../mediaGallery/videoPlayer";
import ZoomableImage from "../mediaGallery/zoomableImage";
import { useEffect, useState } from "react";
import StatusGalleryFooter from "../status/statusGalleryFooter";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-worklets";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { STATUSES } from "../../constants/status";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
export default function StatusGalleryCard({ status }) {


    const [statusIndex, setStatusIndex] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const { index } = useLocalSearchParams();
    const router = useRouter();

    const translateX = useSharedValue(0);


    useEffect(() => {
        setStatusIndex(0);
    }, [index]);

    const handlePrev = () => {
        if (statusIndex > 0) {
            setStatusIndex(statusIndex - 1);
        } else {
            if (Number.parseInt(index) === 0) {
                router.back();
            } else {
                router.replace(`/status/${Number.parseInt(index) - 1}`);
            }
        }
    }

    const handleNext = () => {
        if (statusIndex < status?.statuses?.length - 1) {
            setStatusIndex(statusIndex + 1);
        } else {
            if (Number.parseInt(index) === STATUSES?.length - 1) {
                router.back();
            } else {

                router.replace(`/status/${Number.parseInt(index) + 1}`);
            }
        }
    };


    const handleTimer = (type) => {

        if (type === "start") {
            setIsTimerRunning((prev) => {
                console.log(prev);
                return false;
            });
        } else {
            setIsTimerRunning((prev) => {
                console.log(prev);
                return true;
            });
        }
    };

    const handleRoute = (type) => {
        if (type === "left") {
            if (Number.parseInt(index) > 0) {
                router.replace(`/status/${Number.parseInt(index) - 1}`);
            } else {
                router.replace(`/status`);
            }
        } else {
            if (Number.parseInt(index) < STATUSES?.length - 1) {
                router.replace(`/status/${Number.parseInt(index) + 1}`);
            } else {
                router.replace(`/status`);
            }
        }
    };

    const handleNextPrevSatatus = Gesture.Tap()
        .onEnd((e) => {
            if (e.x < 170 && e.y > 100 && e.y < 500) {
                runOnJS(handlePrev)()
            }
            else if (e.x > 200 && e.y > 100 && e.y < 500) {
                runOnJS(handleNext)()
            }
        });

    const handlePausePlay = Gesture.Pan()
        .onBegin(() => {
            runOnJS(handleTimer)("start");
        })
        .onFinalize(() => {
            runOnJS(handleTimer)("end");
        });

    const handleRouting = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = e.translationX;
            if (translateX.value > 50) {
                runOnJS(handleRoute)("left");
            } else if (translateX.value < -50) {
                runOnJS(handleRoute)("right");
            } else {
                translateX.value = withSpring(0);
            }
        })
        .onFinalize(() => {
            translateX.value = withSpring(0);
        });

    const composedGesture = Gesture.Simultaneous(handleNextPrevSatatus, handlePausePlay, handleRouting);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
        ]
    }));

    return (
        <GestureDetector style={{ flex: 1 }} gesture={composedGesture}>
            <Animated.View style={[{ flex: 1, width: "100%", flexDirection: "column" }, animatedStyle]}>
                <StatusGalleryHeader
                    status={status}
                    statusIndex={statusIndex}
                    handleNext={handleNext}
                    durationInSec={status.statuses[statusIndex]?.durationInSec || 10}
                    isTimerRunning={isTimerRunning}
                />
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {
                        status.statuses[statusIndex]?.type === "image" ? (
                            <ZoomableImage url={status.statuses[statusIndex]?.photoURL} />
                        ) : status.statuses[statusIndex]?.type === "video" ? (
                            <VideoPlayer url={status.statuses[statusIndex]?.videoURL} isTimerRunning={isTimerRunning} />
                        ) : status.statuses[statusIndex]?.type === "video" &&
                        <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: status.statuses[statusIndex]?.bgColor }}>
                            <Text style={{ color: status.statuses[statusIndex]?.textColor }}>{status.statuses[statusIndex]?.text}</Text>
                        </View>
                    }

                </View>
                <StatusGalleryFooter />
            </Animated.View>
        </GestureDetector>
    );
}