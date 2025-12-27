import { TextInput, TouchableOpacity, View, Keyboard, KeyboardAvoidingView, Platform, Text, StyleSheet } from "react-native";
import { Ionicons, FontAwesome6, FontAwesome5, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState, useRef } from "react";

export default function ChatFooter({ id }) {

    const [keyboardHeight, setKeyboardHeight] = useState(336);
    const [isAttachment, setIsAttachment] = useState(false);
    const textInputRef = useRef(null);

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
                }, 300);
            } else {
                Keyboard.dismiss();
                setTimeout(() => {
                    setIsAttachment(!prev)
                }, 600);
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
                        <TouchableOpacity>
                            <Ionicons name="camera-outline" size={28} color="#1fa105" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="mic-outline" size={28} color="#1fa105" />
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    isAttachment &&
                    <View style={[styles.attachmentContainer, { height: keyboardHeight - 13 }]}>
                        <View style={styles.attachmentRow}>
                            <View style={styles.attachmentItem}>
                                <TouchableOpacity style={styles.attachmentItemButton}>
                                    <FontAwesome6 name="photo-film" size={28} color="#60adecff" />
                                </TouchableOpacity>
                                <Text style={styles.attachmentItemText}>Photo</Text>
                            </View>
                            <View style={styles.attachmentItem}>
                                <TouchableOpacity style={styles.attachmentItemButton}>
                                    <Entypo name="camera" size={28} color="black" />
                                </TouchableOpacity>
                                <Text style={styles.attachmentItemText}>Camera</Text>
                            </View>
                            <View style={styles.attachmentItem}>
                                <TouchableOpacity style={styles.attachmentItemButton}>
                                    <FontAwesome6 name="location-dot" size={34} color="#54ce49ee" />
                                </TouchableOpacity>
                                <Text style={styles.attachmentItemText}>Location</Text>
                            </View>
                            <View style={styles.attachmentItem}>
                                <TouchableOpacity style={styles.attachmentItemButton}>
                                    <FontAwesome6 name="contact-book" size={28} color="black" />
                                </TouchableOpacity>
                                <Text style={styles.attachmentItemText}>Contacts</Text>
                            </View>
                        </View>
                        <View style={styles.attachmentRow}>
                            <View style={styles.attachmentItem}>
                                <TouchableOpacity style={styles.attachmentItemButton}>
                                    <Ionicons name="document" size={34} color="#60adecff" />
                                </TouchableOpacity>
                                <Text style={styles.attachmentItemText}>Document</Text>
                            </View>
                            <View style={styles.attachmentItem}>
                                <TouchableOpacity style={styles.attachmentItemButton}>
                                    <FontAwesome5 name="poll-h" size={34} color="#999011ff" />
                                </TouchableOpacity>
                                <Text style={styles.attachmentItemText}>Poll</Text>
                            </View>
                            <View style={styles.attachmentItem}>
                                <TouchableOpacity style={styles.attachmentItemButton}>
                                    <FontAwesome5 name="calendar-alt" size={34} color="#df19ceff" />
                                </TouchableOpacity>
                                <Text style={styles.attachmentItemText}>Event</Text>
                            </View>
                            <View style={styles.attachmentItem}>
                                <TouchableOpacity style={styles.attachmentItemButton}>
                                    <MaterialCommunityIcons name="image-auto-adjust" size={34} color="#60adecff" />
                                </TouchableOpacity>
                                <Text style={styles.attachmentItemText}>AI images</Text>
                            </View>
                        </View>
                    </View>
                }
            </View>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    attachmentContainer: {
        backgroundColor: "#fff",
        paddingVertical: 30,

    },
    attachmentRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginVertical: 13,
        gap: 10
    },
    attachmentItem: {
        alignItems: "center",
        justifyContent: "center",
        gap: 7
    },
    attachmentItemButton: {
        width: 55,
        height: 55,
        borderRadius: "50%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ebebebff"
    },
    attachmentItemText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#000000ff"
    }
});