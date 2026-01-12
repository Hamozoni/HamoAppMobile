import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { RoundedBtn } from "../../buttons/roundedBtn";

interface Message {
    metadata?: {
        type: 'video' | 'voice';
        status: 'missed' | 'completed';
        duration?: string;
    };
}

interface CallMessageBubbleProps {
    message: Message;
}

export default function CallMessageBubble({ message }: CallMessageBubbleProps) {
    return (
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 10, minWidth: 180 }}>
            <View>
                {
                    message?.metadata?.type === "video" ? (
                        <RoundedBtn
                            iconName="videocam"
                            size={24}
                        />
                    ) : (
                        <RoundedBtn
                            iconName="call"
                            size={24}
                        />
                    )
                }
            </View>
            <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{message?.metadata?.type === "video" ? "Video Call" : "Voice Call"}</Text>
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>{message?.metadata?.status === "missed" ? "No Answer" : message?.metadata?.duration}</Text>
            </View>
        </TouchableOpacity>
    );
}
