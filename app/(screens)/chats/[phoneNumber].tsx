import React, { useEffect, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import ChatFooter from "../../../components/chats/chatWindowFooter/chatFooter";
import MessageCard from "../../../components/cards/messageCard";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { usePendingStore } from "../../../hooks/store/usePendingStore";
import { useGetmessages } from "../../../hooks/api/useGetMessagesApi";
import { useChatsStore } from "../../../hooks/store/useChatsStore";
import { useMessagesStore } from "../../../hooks/store/useMessageStore";

import { KeyboardAvoidingView, Platform } from "react-native";
import { useHeaderHeight } from "expo-router/build/react-navigation";


export default function ChatDetails() {

    const { contactId } = useLocalSearchParams<{
        contactId: string;
    }>();

    const headerHeight = useHeaderHeight();
    const chats = useChatsStore((state) => state.chats);
    const currentChatId =
        chats?.find((chat) =>
            chat?.participants?.some((participant) => participant?._id === contactId)
        )?._id


    // 2. Pass currentChatId to your query hook
    const { isLoading, error } = useGetmessages(currentChatId);
    const messages = useMessagesStore(e => e.messages[currentChatId || contactId]);
    const flatListRef = useRef<FlatList>(null);
    console.log({ messages: messages?.find(e => e?._id === "6ade113bb843c57d0263109b") })


    const { pendingLocation, clearPendingLocation } = usePendingStore();

    // ✅ Handle sending pending location
    useEffect(() => {
        if (!pendingLocation) return;
        clearPendingLocation();
    }, [pendingLocation]);

    //     const isNearBottom = useRef(true);
    // const firstLoad = useRef(true);

    // // keep the latest messages visible when the keyboard opens
    // useEffect(() => {
    //     const event = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    //     const sub = Keyboard.addListener(event, () => {
    //         if (isNearBottom.current) {
    //             requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: true }));
    //         }
    //     });
    //     return () => sub.remove();
    // }, []);

    // const handleScroll = (e: any) => {
    //     const offset = e.nativeEvent.contentOffset.y;
    //     const height = e.nativeEvent.layoutMeasurement.height;
    //     const contentHeight = e.nativeEvent.contentSize.height;

    //     if (offset + height >= contentHeight - 20) {
    //         isNearBottom.current = true;
    //     } else {
    //         isNearBottom.current = false;
    //     }

    //     // For first load: snap to end if not already there
    //     if (firstLoad.current && contentHeight > 0) {
    //         flatListRef.current?.scrollToEnd({ animated: false });
    //         isNearBottom.current = true;
    //         firstLoad.current = false;
    //     }
    // };


    // loading indicator
    if (isLoading) {
        return <ActivityIndicator />
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={headerHeight}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                inverted
                keyExtractor={(item) => item.clientMessageId ?? item._id}
                renderItem={({ item, index }) => (
                    <MessageCard message={item} prevMessage={messages[index + 1]} />
                )}
                style={{ flex: 1, flexGrow: 1, }}
                contentContainerStyle={{ padding: 20 }}   // padding goes here, not on `style`
                keyboardShouldPersistTaps="never"       // taps on messages don't get swallowed
                keyboardDismissMode="interactive"    // drag the list down to dismiss the keyboard
                showsVerticalScrollIndicator={false}
            />

            <ChatFooter currentChatId={currentChatId || contactId} />

        </KeyboardAvoidingView>

    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingVertical: 20,
    },
});