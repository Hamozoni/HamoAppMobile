import React, { useEffect, useMemo, useState } from 'react';
import { View, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import MediaGalleryCard from '../../../components/cards/mediaGalleryCard';
import MediaGalleryHeader from '../../../components/mediaGallery/galleryHeader';
import MediaGalleryFooter from '../../../components/mediaGallery/galleryFooter';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMessagesStore } from '../../../hooks/store/useMessageStore';
import { useWindowDimensions } from "react-native";



const MediaGallery = () => {
    const showHeaderAndFooter = useSharedValue(true);
    const swipeTranslateY = useSharedValue(0);
    const router = useRouter();


    const { messageId, chatId } = useLocalSearchParams();

    const [id, setId] = React.useState(String(messageId));

    const messages = useMessagesStore(e => e.messages[chatId]);

    const { width } = useWindowDimensions();


    const messagesList = messages?.filter((e: any) => e.type === "image" || e.type === "video");

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

    const FooterMediaGallery = ({ onMediaSelected, data }: any) => {
        const source = data?.type === "image" ? data?.file?.secureUrl : data?.file?.thumbnailUrl;
        return (
            <TouchableOpacity style={{
                borderWidth: id === data?._id ? 2 : 0,
                borderColor: id === data?._id ? "#007bff" : "transparent",
                borderRadius: 4,
            }} onPress={() => onMediaSelected(data._id)}>
                <Image
                    source={typeof source === 'number' ? source : { uri: source }}
                    style={{ width: 50, height: 50 }}
                />
            </TouchableOpacity>
        );
    };

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const i = messagesList.findIndex((e: any) => String(e?._id) === String(id));
        setIndex(i >= 0 ? i : 0);   // indexOf returns -1 when not found, which crashes FlatList
    }, []);

    const onMediaSelected = (id: string) => {
        setId(id);
    };

    const gesture = Gesture.Simultaneous(onSwipeDown);

    if (!messagesList) return <ActivityIndicator />

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
                        <GestureDetector gesture={oneTap} >
                            <FlatList
                                horizontal
                                pagingEnabled
                                style={{ flex: 1 }}
                                data={messagesList}
                                initialScrollIndex={index}
                                getItemLayout={(data, index) => ({
                                    length: width,
                                    offset: width * index,
                                    index,

                                })}

                                viewabilityConfig={{
                                    itemVisiblePercentThreshold: 50,
                                    viewAreaCoveragePercentThreshold: 50,
                                    waitForInteraction: true,
                                }}
                                renderItem={({ item }) => <MediaGalleryCard metaData={item as any} />}
                                keyExtractor={(item) => item?._id.toString()}
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
                                data={messagesList}
                                renderItem={({ item }) => <FooterMediaGallery onMediaSelected={onMediaSelected} data={item} />}
                                keyExtractor={(item) => item?._id.toString()}
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
