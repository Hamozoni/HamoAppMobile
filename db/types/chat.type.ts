export type MessageType =
    | "text"
    | "image"
    | "video"
    | "audio"
    | "document"
    | "location"
    | "contact"
    | "link";

export type MessageStatus =
    | "pending"
    | "sent"
    | "delivered"
    | "read"
    | "failed";

export interface Chat {
    id: string;
    phoneNumber: string;
    displayName: string | null;
    profilePicture: string | null;

    lastMessageId: string | null;
    lastMessageText: string | null;
    lastMessageType: MessageType;
    lastMessageAt: number | null;
    lastMessageSenderId: string | null;

    unreadCount: number;

    isPinned: 0 | 1;
    isArchived: 0 | 1;
    isMuted: 0 | 1;
    mutedUntil: number | null;

    createdAt: number;
    updatedAt: number;
}

export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    receiverId: string;

    type: MessageType;
    text: string | null;

    // media
    mediaUrl: string | null;
    mediaMimeType: string | null;
    mediaSize: number | null;
    mediaWidth: number | null;
    mediaHeight: number | null;
    mediaDuration: number | null;

    // location
    latitude: number | null;
    longitude: number | null;
    locationName: string | null;

    // contact
    contactName: string | null;
    contactPhone: string | null;
    contactAvatar: string | null;

    // link
    linkUrl: string | null;
    linkTitle: string | null;
    linkDescription: string | null;
    linkThumbnail: string | null;

    // reply
    replyToId: string | null;
    replyToText: string | null;
    replyToType: MessageType | null;

    status: MessageStatus;

    isDeleted: 0 | 1;
    isEdited: 0 | 1;
    isStarred: 0 | 1;

    createdAt: number;
    updatedAt: number;
}