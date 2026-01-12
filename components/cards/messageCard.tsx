import { View } from "react-native";
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

type MessageType = 'text' | 'image' | 'video' | 'contact' | 'location' | 'call' | 'audio' | 'sticker' | 'document';

export interface ChatMessage {
    id: string | number;
    type: MessageType;
    senderId: number;
    text?: string;
    mediaUrl?: any;
    status?: string;
    createdAt?: string;
    timestamp?: string;
    metadata?: any;
}

interface MessageCardProps {
    message: ChatMessage;
}

export default function MessageCard({ message }: MessageCardProps) {

    const MessagesBubble = (): React.ReactElement | null => {
        switch (message?.type) {
            case "text":
                return <TextMessageBubble message={message} />;
            case "image":
                return <ImageMessageBubble message={message} />;
            case "video":
                return <VideoMessageBubble message={message} />;
            case "contact":
                return <ContactMessageBubble message={message} />;
            case "location":
                return <LocationMessageBubble message={message} />;
            case "call":
                return <CallMessageBubble message={message} />;
            case "audio":
                return <AudioMessageBubble message={message} />;
            case "sticker":
                return <ImageMessageBubble message={message} />;
            case "document":
                return <DocumentMessageBubble message={message} />;
            default:
                return null;
        }
    };

    return (
        <View
            style={{
                marginVertical: 2,
                backgroundColor: message?.type === "sticker" ? "transparent" : message?.senderId === 1 ? "#007AFF" : "#efefffff",
                borderRadius: 10,
                padding: 3,
                minWidth: 30,
                maxWidth: "88%",
                alignSelf: message?.senderId === 1 ? "flex-end" : "flex-start",
            }}
            key={message?.id}
        >
            <View
                style={{
                    padding: message?.type === "image" || message?.type === "video" || message?.type === "sticker" || message?.type === "document" || message?.type === "location" ? 0 : 10,
                    borderRadius: 10,
                    backgroundColor: message?.type === "sticker" ? "transparent" : "#1807071a",
                }}>
                <MessagesBubble />
                {
                    (message?.type !== "call" && message?.type !== "audio") && (
                        <MessageStatusBubble message={message} />
                    )
                }
            </View>
        </View>
    );
}
