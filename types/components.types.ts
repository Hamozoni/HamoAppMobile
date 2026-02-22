import { TextInput } from 'react-native';

// ============ Navigation Types ============
export interface RouteParams {
    id?: string;
    phone?: string;
    index?: string;
    isEdit?: string;
}

// ============ Chat Types ============
export interface Contact {
    id?: string;
    displayName: string;
    phoneNumber?: string;
    photoURL?: any;
    about?: string;
}

export interface Message {
    id?: string;
    text?: string;
    mediaUrl?: any;
    mediaType?: 'image' | 'video' | 'audio' | 'document';
    senderId?: string | number;
    createdAt?: string;
    status?: string;
}

export type MessageType = "text" | "audio" | "image" | "video" | "location" | "contact";

export interface LastMessage {
    text?: string;
    type: MessageType;
    createdAt: string;
    isRead?: boolean;
    isMine?: boolean;
}

export interface Chat {
    id: string;
    contact: {
        displayName: string;
        photoURL: string | any;
    };
    lastMessage: LastMessage;
    unreadCount?: number;
    isOnline?: boolean;
}

// ============ Call Types ============
export type CallStatus = 'Missed' | 'Incoming' | 'Outgoing';

export interface Caller {
    displayName: string;
    created: string;
    photoURL?: string;
}

export interface Call {
    id: number;
    status: CallStatus;
    caller: Caller;
    duration?: string;
    type?: 'audio' | 'video';
}

// ============ Status Types ============
export interface StatusItem {
    id: number;
    type: 'image' | 'video' | 'text';
    photoURL?: any;
    thumbnail?: any;
    videoURL?: any;
    text?: string;
    bgColor?: string;
    textColor?: string;
    createdAt: string;
    durationInSec?: number;
}

export interface Status {
    name: string;
    photoURL: any;
    _id: string;
    statuses: StatusItem[];
}

export interface StatusGroup {
    contact: Contact;
    statuses: StatusItem[];
    lastUpdated: string;
}

// ============ Component Props ============
export interface SeparatorProps {
    height?: number;
}

export interface SearchInputProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
}

export interface ChevronBackBtnProps {
    onPress?: () => void;
    color?: string;
}

export interface RoundedBtnProps {
    title?: string;
    onPress?: () => void;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
}

export interface SwitchedBtnProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    label?: string;
}

export interface TitleForwardIconBtnProps {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    icon?: string;
    showArrow?: boolean;
}

export interface ChatCardProps {
    chat: Chat;
}

export interface CallCardProps {
    call: Call;
}

export interface ContactCardProps {
    contact: Contact;
    onPress?: () => void;
}

// ============ OTP Input Refs ============
export type OtpInputRefs = (TextInput | null)[];

// ============ Media Gallery Types ============
export interface MediaItem {
    id: string;
    uri: string;
    type: 'image' | 'video';
    duration?: number;
    createdAt: string;
}

export interface GallerySection {
    title: string;
    data: MediaItem[];
}
