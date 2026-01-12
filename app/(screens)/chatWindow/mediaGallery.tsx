import React from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import MediaGalleryCard from '../../../components/cards/mediaGalleryCard';
import MediaGalleryHeader from '../../../components/mediaGallery/galleryHeader';
import MediaGalleryFooter from '../../../components/mediaGallery/galleryFooter';
import { useRouter } from 'expo-router';
import { MESSAGES } from '../../../constants/messages';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatMessage } from '../../../components/cards/messageCard';

const messages: ChatMessage[] = MESSAGES.filter((item) => item.type === "image" || item.type === "video");

const MediaGallery = () => {
    const showHeaderAndFooter = useSharedValue(true);
    const swipeTranslateY = useSharedValue(0);
    const router = useRouter();

    const onBack = () => {
        router.back();
    };

    const onSwipeDown = Gesture.Pan()
        .onUpdate((e) => {
            swipeTranslateY.value = e.translationY;
        })
        .onEnd(() => {
            if (swipeTranslateY.value > 150 || swipeTranslateY.value < -150) {
                runOnJS(onBack)();
            } else {
                swipeTranslateY.value = withSpring(0);
            }
        });

    const oneTap = Gesture.Tap()
        .numberOfTaps(1)
        .onEnd(() => {
            showHeaderAndFooter.value = !showHeaderAndFooter.value;
        });

    const style = useAnimatedStyle(() => ({
        transform: [
            { translateY: swipeTranslateY.value }
        ]
    }));

    const headerStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: showHeaderAndFooter.value ? 0 : -100 }
        ],
        opacity: showHeaderAndFooter.value ? 1 : 0,
    }));

    const footerStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: showHeaderAndFooter.value ? 0 : 100 }
        ],
        opacity: showHeaderAndFooter.value ? 1 : 0
    }));

    const FooterMediaGallery = ({ data }: { data: ChatMessage }) => {
        const source = data?.type === "image" ? data?.metadata?.url : data?.metadata?.thumbnailUrl;
        return (
            <Image
                source={typeof source === 'number' ? source : { uri: source }}
                style={{ width: 50, height: 50 }}
            />
        );
    };

    const gesture = Gesture.Simultaneous(onSwipeDown);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <GestureDetector gesture={gesture}>
                <View style={{ flex: 1, backgroundColor: "#eee" }}>
                    <Animated.View
                        style={[
                            headerStyle,
                            styles.headerContainer
                        ]}
                    >
                        <MediaGalleryHeader />
                    </Animated.View>
                    <Animated.View style={[styles.galleryContainer, style]}>
                        <GestureDetector gesture={oneTap}>
                            <FlatList
                                horizontal
                                pagingEnabled
                                style={{ flex: 1 }}
                                data={messages}
                                renderItem={({ item }) => <MediaGalleryCard metaData={item as any} />}
                                keyExtractor={(item) => item.id.toString()}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
                            />
                        </GestureDetector>
                    </Animated.View>
                    <Animated.View
                        style={[
                            footerStyle,
                            styles.footerContainer
                        ]}
                    >
                        <View style={{ flex: 1, marginBottom: 10 }}>
                            <FlatList
                                horizontal
                                data={messages}
                                renderItem={({ item }) => <FooterMediaGallery data={item} />}
                                keyExtractor={(item) => item.id.toString()}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ alignItems: "center", gap: 2 }}
                            />
                        </View>
                        <MediaGalleryFooter />
                    </Animated.View>
                </View>
            </GestureDetector>
        </SafeAreaView >
    )
};

const styles = StyleSheet.create({
    headerContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 3,
        backgroundColor: "black",
        padding: 10
    },
    footerContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 3,
        backgroundColor: "black",
        padding: 10
    },
    galleryContainer: {
        flex: 1, alignItems: "center", justifyContent: "center"
    },
});

export default MediaGallery;
