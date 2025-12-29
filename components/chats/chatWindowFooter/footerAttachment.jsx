import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, FontAwesome6, Entypo, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

export default function FooterAttachment({ keyboardHeight }) {
    return (
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