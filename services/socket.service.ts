import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL!;

export const SOCKET_EVENTS = {
    // Connection
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    CONNECT_ERROR: "connect_error",

    // Chat room
    JOIN_CHAT: "chat:join",
    LEAVE_CHAT: "chat:leave",

    // Messages
    MESSAGE_SEND: "message:send",
    MESSAGE_NEW: "message:new",
    MESSAGE_DELIVERED: "message:delivered",
    MESSAGE_READ: "message:read",
    MESSAGE_READ_ALL: "message:read_all",
    MESSAGE_DELETED: "message:deleted",
    MESSAGE_EDITED: "message:edited",

    // Typing
    TYPING_START: "typing:start",
    TYPING_STOP: "typing:stop",

    // Online status
    USER_ONLINE_STATUS: "user:online_status",
} as const;

class SocketService {

    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    // ── Connect ──────────────────────────────────────
    async connect(): Promise<void> {

        if (this.socket?.connected) return;
        const token = await SecureStore.getItemAsync("accessToken");
        if (!token) {
            console.log("⚠️ No access token — socket not connected");
            return;
        }

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ["websocket"], // skip long-polling for React Native
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 10000,
        });

        this.setupListeners();
    }

    // ── Disconnect ───────────────────────────────────
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log("🔌 Socket disconnected");
        }
    }

    // ── Reconnect with new token (after refresh) ─────
    async reconnect(): Promise<void> {
        this.disconnect();
        await this.connect();
    }

    // ── Core listeners ───────────────────────────────
    private setupListeners(): void {
        if (!this.socket) return;

        this.socket.on(SOCKET_EVENTS.CONNECT, () => {
            console.log("✅ Socket connected:", this.socket?.id);
            this.reconnectAttempts = 0;
        });

        this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
            console.log("❌ Socket disconnected:", reason);

            // Auto reconnect unless intentional
            if (reason === "io server disconnect") {
                this.connect();
            }
        });

        this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
            console.error("🔴 Socket connection error:", error.message);
            this.reconnectAttempts++;

            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error("🔴 Max reconnection attempts reached");
            }
        });
    }

    // ── Emit ─────────────────────────────────────────
    emit(event: string, data?: any): void {
        if (!this.socket?.connected) {
            console.warn(`⚠️ Socket not connected — cannot emit ${event}`);
            return;
        }
        this.socket.emit(event, data);
    }

    // ── Listen ───────────────────────────────────────
    on(event: string, callback: (...args: any[]) => void): void {
        this.socket?.on(event, callback);
    }

    off(event: string, callback?: (...args: any[]) => void): void {
        this.socket?.off(event, callback);
    }

    // ── Chat room ────────────────────────────────────
    joinChat(chatId: string): void {
        this.emit(SOCKET_EVENTS.JOIN_CHAT, chatId);
    }

    leaveChat(chatId: string): void {
        this.emit(SOCKET_EVENTS.LEAVE_CHAT, chatId);
    }

    // ── Typing ───────────────────────────────────────
    startTyping(chatId: string): void {
        this.emit(SOCKET_EVENTS.TYPING_START, { chatId });
    }

    stopTyping(chatId: string): void {
        this.emit(SOCKET_EVENTS.TYPING_STOP, { chatId });
    }

    // ── Status ───────────────────────────────────────
    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    getSocketId(): string | undefined {
        return this.socket?.id;
    }
}

// Singleton — one instance across the whole app
export const socketService = new SocketService();
export default socketService;