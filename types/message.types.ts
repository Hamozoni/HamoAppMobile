export type MessageType =
    | "text" | "image" | "video" | "audio"
    | "document" | "location" | "contact" | "link" | "call" | "sticker";

export type MessageStatus =
    | "pending" | "sent" | "delivered" | "read" | "failed";


export interface SendMessagePayload {
    chatId?: string;
    receiverId?: string;      // ✅ optional — server resolves from phoneNumber
    phoneNumber?: string;      // ✅ optional — used when no receiverId
    type: MessageType;
    text?: string;
    fileId?: string;
    location?: { latitude: number; longitude: number; name?: string };
    contact?: { displayName: string; phoneNumber: string; avatar?: string };
    link?: { url: string; title?: string; description?: string; thumbnail?: string };
    replyTo?: { messageId: string; text?: string; type: string; senderId: string; fileId?: string };
    clientMessageId: string;
}

// What the user builds before sending
export interface MessageDraft {
    text?: string;
    asset?: any;        // expo image/video/audio/document asset
    assetType?: MessageType;
    location?: { latitude: number; longitude: number; name?: string };
    contact?: { displayName: string; phoneNumber: string; avatar?: string };
    replyTo?: any;
}

export interface NewMessageData {
    message: ILocalMessage;
    chatId: string;
    clientMessageId?: string;
}

// types/message.types.ts
export interface ILocalMessage {
    _id: string;
    chatId: string;
    senderId: string | { _id: string; displayName: string; profilePicture?: any };
    receiverId: string;
    type: MessageType;
    text?: string | null;
    file?: {
        _id: string;
        secureUrl: string;
        thumbnailUrl?: string;
        type: string;
        metadata: any;
    } | null;
    location?: { latitude: number; longitude: number; name?: string } | null;
    contact?: { displayName: string; phoneNumber: string; avatar?: string } | null;
    status: string;
    isDeleted: boolean;
    isEdited: boolean;
    isStarred: boolean;
    createdAt: string;
    updatedAt: string;
    clientMessageId?: string;
    isOptimistic?: boolean;
    replyTo?: any;
}