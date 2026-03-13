import React from "react";
import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ILocalMessage } from "../../../types/message.types";
import { formatMessageTime } from "../../../utils";



interface MessageStatusBubbleProps {
    message: ILocalMessage;
    isMine: boolean
}

export default function MessageStatusBubble({ message, isMine }: MessageStatusBubbleProps) {
    const isMedia = message?.type === "image" || message?.type === "video" || message?.type === "location";

    if (message?.senderId) {
        return (
            <View
                style={{
                    position: isMedia ? "absolute" : undefined,
                    bottom: 0,
                    right: 0,
                    paddingHorizontal: 5,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 5,
                        height: 8,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 10,
                    backgroundColor: isMedia ? "#00000011" : "transparent",
                    gap: 5
                }}
            >
                <Text
                    style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: isMine ? "#ecececff" : "#353535ff"
                    }}
                >{formatMessageTime(message?.createdAt)}
                </Text>
                {
                    isMine &&
                    <View >
                        {
                            message?.status === "sent" ? (
                                <Ionicons name="checkmark-sharp" size={16} color="white" />
                            ) : message?.status === "delivered" || message?.status === "readed" ? (
                                <Ionicons name="checkmark-done-sharp" size={16} color={message?.status === "delivered" ? "white" : "#80e280ff"} />
                            ) : (
                                <Ionicons name="stopwatch-outline" size={16} color="white" />
                            )
                        }
                    </View>
                }
            </View>
        );
    }
    return null;
}
