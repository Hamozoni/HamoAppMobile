import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function AudioRecorder() {

    const [timer, setTimer] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(null);


    return (
        <View>
            <View>
                <Text>{timer}</Text>
                <View>

                </View>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="timer-alert-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
                <TouchableOpacity>
                    <Ionicons name="trash-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="pause-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="send" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}