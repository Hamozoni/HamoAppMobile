import { Chat } from "../types/components.types";

export const CHATS: Chat[] = [
    {
        id: "1",
        contact: {
            displayName: "Sarah Mitchell",
            photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        },
        lastMessage: {
            type: "text",
            text: "Are you coming to the meeting tomorrow?",
            createdAt: "12:45 PM",
            isMine: false,
        },
        unreadCount: 3,
        isOnline: true,
    },
    {
        id: "2",
        contact: {
            displayName: "Carlos Rivera",
            photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
        },
        lastMessage: {
            type: "image",
            text: "Photo",
            createdAt: "11:20 AM",
            isMine: true,
            isRead: true,
        },
        unreadCount: 0,
        isOnline: false,
    },
    {
        id: "3",
        contact: {
            displayName: "Aisha Patel",
            photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
        },
        lastMessage: {
            type: "audio",
            text: "0:42",
            createdAt: "10:05 AM",
            isMine: false,
        },
        unreadCount: 1,
        isOnline: true,
    },
    {
        id: "4",
        contact: {
            displayName: "Liam Thompson",
            photoURL: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&q=80",
        },
        lastMessage: {
            type: "video",
            text: "Video",
            createdAt: "Yesterday",
            isMine: false,
        },
        unreadCount: 0,
        isOnline: false,
    },
    {
        id: "5",
        contact: {
            displayName: "Yuki Tanaka",
            photoURL: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
        },
        lastMessage: {
            type: "location",
            text: "Live Location",
            createdAt: "Yesterday",
            isMine: true,
            isRead: false,
        },
        unreadCount: 7,
        isOnline: true,
    },
    {
        id: "6",
        contact: {
            displayName: "Omar Hassan",
            photoURL: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&q=80",
        },
        lastMessage: {
            type: "contact",
            text: "James Anderson",
            createdAt: "Monday",
            isMine: false,
        },
        unreadCount: 0,
        isOnline: false,
    },
    {
        id: "7",
        contact: {
            displayName: "Emily Chen",
            photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80",
        },
        lastMessage: {
            type: "text",
            text: "Did you see the game last night? 🔥",
            createdAt: "Monday",
            isMine: false,
        },
        unreadCount: 2,
        isOnline: true,
    },
    {
        id: "8",
        contact: {
            displayName: "Marcus Williams",
            photoURL: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&q=80",
        },
        lastMessage: {
            type: "audio",
            text: "1:15",
            createdAt: "Sunday",
            isMine: true,
            isRead: true,
        },
        unreadCount: 0,
        isOnline: false,
    },
];