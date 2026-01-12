import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";
import { RoundedBtn } from "../buttons/roundedBtn";
import React from "react";

export default function StatusGalleryFooter() {
    return (
        <KeyboardAvoidingView keyboardVerticalOffset={50} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 10 }}>
                <View style={{ padding: 10, borderWidth: 2, borderColor: "#d4d4d4ff", borderRadius: 20, flex: 1, backgroundColor: "#fff" }}>
                    <TextInput placeholder="Reply" style={{ fontSize: 16, width: "100%" }} />
                </View>
                <RoundedBtn iconName="heart-outline" size={30} />
            </View>
        </KeyboardAvoidingView>
    );
}
