import { TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";

export default function ChatFooter({ id }) {

    const [isMedia, setIsMedia] = useState(false);

    return (
        <View style={{ paddingHorizontal: 10, paddingTop: 10, backgroundColor: "#fff" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <TouchableOpacity
                    style={{
                        width: 30,
                        height: 30,
                        justifyContent: "center",
                        alignItems: "center"
                    }} onPress={() => setIsMedia(prev => !prev)}>
                    {
                        isMedia ?
                            <FontAwesome6 name="keyboard" size={25} color="#1fa105" />
                            : <Ionicons name="add-outline" size={30} color="#1fa105" />

                    }
                </TouchableOpacity>
                <TextInput
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

        </View>
    );
}