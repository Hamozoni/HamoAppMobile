import React, { useEffect, useState, useRef } from "react";
import {
    TextInput, TouchableOpacity, View,
    Keyboard, StyleSheet, Platform, Image,
    KeyboardAvoidingView,
} from "react-native";
import { Ionicons, FontAwesome6, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import FooterAttachment from "./footerAttachment";
import AudioRecorder from "./audioRecorder";
import { MessageDraft, MessageType } from "../../../types/message.types";

const WA_GREEN = "#25D366";

interface ChatFooterProps {
    onFocus: () => void;
    sendMessage: (draft: MessageDraft) => void;
}

export default function ChatFooter({ onFocus, sendMessage }: ChatFooterProps) {

    const [keyboardHeight, setKeyboardHeight] = useState(336);
    const [isAttachment, setIsAttachment] = useState(false);
    const [isAudioRecorder, setIsAudioRecorder] = useState(false);
    const [text, setText] = useState("");
    const [asset, setAsset] = useState<any>(null);
    const [assetType, setAssetType] = useState<MessageType>("image");
    const textInputRef = useRef<TextInput>(null);
    const router = useRouter();

    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", e => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        return () => show.remove();
    }, []);

    const toggleAttachment = () => {
        if (isAttachment) {
            textInputRef.current?.focus();
            setTimeout(() => setIsAttachment(false), 200);
        } else {
            Keyboard.dismiss();
            setTimeout(() => setIsAttachment(true), 350);
        }
    };

    // ✅ Send text / media / mixed
    const handleSend = () => {
        if (!text.trim() && !asset) return;
        sendMessage({
            text: text.trim() || undefined,
            asset,
            assetType,
        });
        setText("");
        setAsset(null);
    };

    // ✅ Called from FooterAttachment when image/video/document picked
    const handleAssetPicked = (pickedAsset: any, type: MessageType) => {
        setAsset(pickedAsset);
        setAssetType(type);
        setIsAttachment(false);
    };

    // ✅ Called from AudioRecorder when send pressed
    const handleSendAudio = (uri: string) => {
        sendMessage({
            asset: {
                uri,
                mimeType: "audio/m4a",
                fileName: "voice.m4a",
            },
            assetType: "audio",
        });
        setIsAudioRecorder(false);
    };

    const hasContent = text.trim().length > 0 || !!asset;


    const handleOnFocus = () => {
        setIsAttachment(false);
        onFocus();
    }

    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={80}
        >
            <View style={styles.wrapper}>

                {/* ── Asset preview ──────────────────── */}
                {asset && (assetType === "image" || assetType === "video") && (
                    <View style={styles.previewRow}>
                        <Image
                            source={{ uri: asset.uri }}
                            style={styles.preview}
                        />
                        <TouchableOpacity
                            onPress={() => setAsset(null)}
                            style={styles.removeBtn}
                        >
                            <Ionicons name="close-circle" size={22} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* ── Input row ──────────────────────── */}
                <View style={styles.inputRow}>

                    {/* Attachment toggle */}
                    <TouchableOpacity onPress={toggleAttachment} style={styles.iconBtn}>
                        {isAttachment
                            ? <FontAwesome6 name="keyboard" size={22} color="#76787a" />
                            : <Entypo name="attachment" size={22} color="#76787a" />
                        }
                    </TouchableOpacity>

                    {/* Text input */}
                    <TextInput
                        ref={textInputRef}
                        value={text}
                        onChangeText={setText}
                        onFocus={handleOnFocus}
                        placeholder={asset ? "Add a caption..." : "Message"}
                        placeholderTextColor="#9DB2BF"
                        multiline
                        style={styles.input}
                    />

                    {/* Right actions */}
                    {hasContent ? (
                        // ✅ Send button when there's content
                        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
                            <Ionicons name="send" size={18} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        // Camera + Mic when empty
                        <View style={styles.rightActions}>
                            <TouchableOpacity onPress={() => router.push("/chats/camera" as any)}>
                                <Ionicons name="camera-outline" size={26} color="#76787a" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsAudioRecorder(true)}>
                                <Ionicons name="mic-outline" size={26} color="#76787a" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* ── Panels ─────────────────────────── */}
                {isAttachment && (
                    <FooterAttachment
                        keyboardHeight={keyboardHeight}
                        setIsAttachment={setIsAttachment}
                        onAssetPicked={handleAssetPicked}   // ✅
                        onLocationPick={() => router.push("/chats/location" as any)}
                        onContactPick={() => router.push("/chats/shareContacts" as any)}
                    />
                )}

                {isAudioRecorder && (
                    <AudioRecorder
                        setIsAudioRecorder={setIsAudioRecorder}
                        onSendAudio={handleSendAudio}   // ✅
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#fff",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#E5E7EB",
        paddingBottom: Platform.OS === "ios" ? 24 : 8,
    },
    previewRow: {
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    preview: {
        width: 120,
        height: 120,
        borderRadius: 10,
    },
    removeBtn: {
        position: "absolute",
        top: 6,
        left: 112,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 10,
        paddingTop: 8,
        gap: 8,
    },
    iconBtn: {
        width: 36,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 120,
        backgroundColor: "#F0F2F5",
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === "ios" ? 10 : 6,
        fontSize: 15,
        color: "#111B21",
    },
    rightActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingBottom: 8,
        flexShrink: 0,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: WA_GREEN,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
        shadowColor: WA_GREEN,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 4,
    },
});

