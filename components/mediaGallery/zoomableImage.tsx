import React from "react";
import { Dimensions, ImageSourcePropType } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

interface ZoomableImageProps {
    url: ImageSourcePropType;
}

const ZoomableImage = ({ url }: ZoomableImageProps) => {
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            if (scale.value > 1) {
                scale.value = withSpring(1);
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            } else {
                scale.value = withSpring(2.5);
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

    return (
        <GestureDetector gesture={composedGesture}>
            <Animated.Image
                source={url}
                style={[animatedStyle, { width, height, resizeMode: "contain" }]}
            />
        </GestureDetector>
    );
};

export default ZoomableImage;
