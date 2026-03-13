import { StyleSheet, Text, View } from "react-native";
import {
    TextMessageBubble,
    ImageMessageBubble,
    VideoMessageBubble,
    ContactMessageBubble,
    LocationMessageBubble,
    CallMessageBubble,
    DocumentMessageBubble,
    AudioMessageBubble,
    MessageStatusBubble
} from "../chats/messagesBubals";
import React from "react";
import { ILocalMessage } from "../../types/message.types";
import { useAuthStore } from "../../hooks/store/useAuthStore";

import { formatMessageDate, isSameDay } from "../../utils/formatTime";

interface MessageCardProps {
    message: ILocalMessage;
    prevMessage: ILocalMessage
}

export default function MessageCard({ message, prevMessage }: MessageCardProps) {

    const user = useAuthStore(state => state.user);
    const isMine = message.senderId === user?._id ||
        (message.senderId as any)?._id === user?._id;

    const showDateSeparator = !prevMessage ||
        !isSameDay(message.createdAt, prevMessage.createdAt);

    const isMedia = ["image", "video", "sticker", "document", "location"].includes(message.type);

    const MessagesBubble = (): React.ReactElement | null => {
        switch (message?.type) {
            case "text": return <TextMessageBubble message={message} isMine={isMine} />;
            case "image": return <ImageMessageBubble message={message} isMine={isMine} />;
            case "video": return <VideoMessageBubble message={message} isMine={isMine} />;
            case "contact": return <ContactMessageBubble message={message} isMine={isMine} />;
            case "location": return <LocationMessageBubble message={message} isMine={isMine} />;
            case "call": return <CallMessageBubble message={message} isMine={isMine} />;
            case "audio": return <AudioMessageBubble message={message} isMine={isMine} />;
            case "sticker": return <ImageMessageBubble message={message} isMine={isMine} />;
            case "document": return <DocumentMessageBubble message={message} isMine={isMine} />;
            default: return null;
        }
    };

    return (

        <>
            {showDateSeparator && (
                <View style={styles.dateSeparator}>
                    <Text style={styles.dateText}>
                        {formatMessageDate(message.createdAt)}
                    </Text>
                </View>
            )}
            <View
                style={{
                    marginVertical: 2,
                    alignSelf: isMine ? "flex-end" : "flex-start",  // ✅ side
                }}
            >
                <View
                    style={{
                        backgroundColor:
                            message.type === "sticker" ? "transparent" :
                                isMine ? "#0c5679ff" : "#fff",              // ✅ color
                        borderRadius: 10,
                        padding: isMedia ? 0 : 10,
                        minWidth: 30,
                        maxWidth: "88%",
                        // ✅ shadow for received messages
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08,
                        shadowRadius: 2,
                        elevation: 1,
                    }}
                >
                    <MessagesBubble />
                    {(message.type !== "call" && message.type !== "audio") && (
                        <MessageStatusBubble message={message} isMine={isMine} />
                    )}
                </View>
            </View>
        </>
    );
};


const styles = StyleSheet.create({
    dateSeparator: {
        alignSelf: "center",
        backgroundColor: "#e2e8f0",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginVertical: 12,
    },
    dateText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#667781",
    },
});
