import { TextInput, TouchableOpacity, View, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import FooterAttachment from "./footerAttachment";

export default function ChatFooter({ id }) {

    const [keyboardHeight, setKeyboardHeight] = useState(336);
    const [isAttachment, setIsAttachment] = useState(false);
    const textInputRef = useRef(null);
    const router = useRouter();

    useEffect(() => {

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                console.log(e.endCoordinates.height);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    const toggleAttachment = () => {
        setIsAttachment(prev => {
            if (prev) {
                textInputRef.current.focus();
                setTimeout(() => {
                    setIsAttachment(!prev)
                }, 200);
            } else {
                Keyboard.dismiss();
                setTimeout(() => {
                    setIsAttachment(!prev)
                }, 400);
            }
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset="100"
        >
            <View style={{ paddingHorizontal: 10, paddingTop: 10, backgroundColor: "#fff" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <TouchableOpacity
                        style={{
                            width: 30,
                            height: 30,
                            justifyContent: "center",
                            alignItems: "center"
                        }} onPress={() => toggleAttachment()}>
                        {
                            isAttachment ?
                                <FontAwesome6 name="keyboard" size={25} color="#1fa105" />
                                : <Ionicons name="add-outline" size={30} color="#1fa105" />

                        }
                    </TouchableOpacity>
                    <TextInput
                        ref={textInputRef}
                        onFocus={() => setIsAttachment(false)}
                        placeholder="Type a message"
                        style={{ height: 30, flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 10 }}
                    />
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <TouchableOpacity onPress={() => router.push("/chats/camera")}>
                            <Ionicons name="camera-outline" size={28} color="#1fa105" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="mic-outline" size={28} color="#1fa105" />
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    isAttachment &&
                    <FooterAttachment keyboardHeight={keyboardHeight} />
                }
            </View>
        </KeyboardAvoidingView>
    );
};
