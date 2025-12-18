import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width, height } = Dimensions.get("window");

export default function VideoScreen({ url, isTimerRunning = true }) {

    const player = useVideoPlayer(url, player => {
        player.loop = true;
    });

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedX = useSharedValue(0);
    const savedY = useSharedValue(0);


    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            if (scale.value > 1) {
                scale.value = withSpring(1);
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                savedScale.value = 1;
                savedX.value = 0;
                savedY.value = 0;
            } else {
                scale.value = withSpring(2.5);
                savedScale.value = 2.5;
            }
        });

    const composedGesture = Gesture.Simultaneous(doubleTap);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translateX.value },
            { translateY: translateY.value },
        ]
    }));

    useEffect(() => {
        if (player && isTimerRunning) {
            if (!player.isPlaying) {
                player.play();
            }
        }
        if (player && !isTimerRunning) {
            player.pause();

        }

        return () => {
            if (player) {
                if (player.isPlaying) {
                    player.pause()
                }
            }
        }
    }, [player, isTimerRunning]);

    return (
        <GestureDetector gesture={composedGesture}>
            <Animated.View style={animatedStyle}>
                <VideoView
                    style={{ width, height }}
                    player={player}
                    nativeControls={false}
                />
            </Animated.View>
        </GestureDetector>
    );
}