import { io, Socket } from "socket.io-client";


export const SOCKET_EVENTS = {
    // Connection
    CONNECT: "connect",
    DISCONNECT: "disconnect",

    // Chat room
    JOIN_CHAT: "chat:join",
    LEAVE_CHAT: "chat:leave",

    // Messages
    MESSAGE_SEND: "message:send",
    MESSAGE_NEW: "message:new",
    MESSAGE_STATUS: "message:status",
    MESSAGE_STATUS_ALL: "message:status_all",
    MESSAGE_DELETED: "message:deleted",
    MESSAGE_EDITED: "message:edited",

    // Typing
    TYPING_START: "typing:start",
    TYPING_STOP: "typing:stop",


    // Online status
    USER_ONLINE_STATUS: "user:online_status",

    // Errors
    ERROR: "error",
    CONNECT_ERROR: "connect_error",
} as const;

export type SOCKET_EVENT = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS]

class SocketService {
    public socket: Socket | null = null;
    public isSocketConnected: boolean = false;

    // Pass the JWT token from your auth state/secure storage when connecting
    connect(accessToken: string) {
        if (this.socket?.connected) return;

        const serverUrl = "http://172.20.10.3:3000";
        console.log("🔌 Connecting to Socket.io server at:", serverUrl);

        this.socket = io(serverUrl, {
            auth: {
                token: accessToken, // 👈 Required by your backend middleware
            },
            transports: ["polling", "websocket"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on(SOCKET_EVENTS.CONNECT, () => {
            this.isSocketConnected = true;
            console.log("🟢 Connected to Socket.io server:", this.socket?.id);
        });

        this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
            this.isSocketConnected = false;
            console.log("🔴 Disconnected from server:", reason);
        });

        this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
            this.isSocketConnected = false;
            this.socket = null;
            // If you see "Authentication token required" or "Authentication failed", check your token here
            console.log("⚠️ Connection Error:", error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    emit(event: string, data: any, callback?: Function) {
        if (this.socket?.connected) {
            if (callback) {
                this.socket.emit(event, data, callback);
            } else {
                this.socket.emit(event, data);
            }
        } else {
            console.warn("⚠️ Socket not connected. Cannot emit event:", event);
        }
    }

    on(event: string, callback: (data: any) => void) {
        this.socket?.on(event, callback);
    }

    off(event: string) {
        this.socket?.off(event);
    }
}

export const socketService = new SocketService();