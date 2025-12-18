import { SafeAreaView } from "react-native-safe-area-context";
import StatusGalleryCard from "../../components/cards/statusGalleryCard";
import { STATUSES } from "../../constants/status";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

const StatusGallery = () => {

    const { index } = useLocalSearchParams();

    const swipeTranslateY = useSharedValue(0);
    const router = useRouter();

    const onBack = () => {
        router.back();
    };

    const onSwipeDown = Gesture.Pan()
        .onUpdate((e) => {
            swipeTranslateY.value = e.translationY
        })
        .onEnd(() => {
            if (swipeTranslateY.value > 150 || swipeTranslateY.value < -150) {
                runOnJS(onBack)();
            } else {
                swipeTranslateY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: swipeTranslateY.value }],
        };
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GestureDetector gesture={onSwipeDown}>
                <Animated.View style={[{ flex: 1, zIndex: 10 }, animatedStyle]}>
                    <StatusGalleryCard
                        status={STATUSES[Number.parseInt(index)]}
                    />
                </Animated.View>
            </GestureDetector>
        </SafeAreaView>
    );
};

export default StatusGallery;
