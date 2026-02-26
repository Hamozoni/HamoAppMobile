import React, { useEffect, useState, useRef } from "react";
import { TextInput, TouchableOpacity, View, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons, FontAwesome6, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import FooterAttachment from "./footerAttachment";
import AudioRecorder from "./audioRecorder";

interface ChatFooterProps {
    phoneNumber: string;
}

export default function ChatFooter({ phoneNumber }: ChatFooterProps) {
    const [keyboardHeight, setKeyboardHeight] = useState(336);
    const [isAttachment, setIsAttachment] = useState(false);
    const [isAudioRecorder, setIsAudioRecorder] = useState(false);
    const textInputRef = useRef<TextInput>(null);
    const router = useRouter();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    const toggleAttachment = () => {
        if (isAttachment) {
            textInputRef.current?.focus();
            setTimeout(() => {
                setIsAttachment(false);
            }, 200);
        } else {
            Keyboard.dismiss();
            setTimeout(() => {
                setIsAttachment(true);
            }, 400);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "position"}
            keyboardVerticalOffset={80}
        >
            <View style={{ padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#eee" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <TouchableOpacity
                        style={{
                            width: 30,
                            height: 30,
                            justifyContent: "center",
                            alignItems: "center"
                        }} onPress={toggleAttachment}>
                        {
                            isAttachment ?
                                <FontAwesome6 name="keyboard" size={25} color="#76787aff" />
                                : <Entypo name="attachment" size={24} color="#76787aff" />
                        }
                    </TouchableOpacity>
                    <TextInput
                        ref={textInputRef}
                        onFocus={() => setIsAttachment(false)}
                        placeholder="Type a message"
                        style={{ height: 40, paddingVertical: 0, flex: 1, borderWidth: 1, fontSize: 14, textAlignVertical: "center", borderColor: "#76787aff", borderRadius: 20, paddingHorizontal: 10 }}
                    />
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <TouchableOpacity onPress={() => router.push("/chats/camera" as any)}>
                            <Ionicons name="camera-outline" size={28} color="#76787aff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsAudioRecorder(true)}>
                            <Ionicons name="mic-outline" size={28} color="#76787aff" />
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    isAttachment &&
                    <FooterAttachment keyboardHeight={keyboardHeight} setIsAttachment={setIsAttachment} />
                }
                {
                    isAudioRecorder &&
                    <AudioRecorder setIsAudioRecorder={setIsAudioRecorder} />
                }
            </View>
        </KeyboardAvoidingView>
    );
}

