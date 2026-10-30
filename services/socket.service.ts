import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";
import { refreshSession } from "../lib/axios.config";

export const SOCKET_EVENTS = {
    CONNECT: "connect",
    DISCONNECT: "disconnect",

    JOIN_CHAT: "chat:join",
    LEAVE_CHAT: "chat:leave",
    CHAT_NOTIFICATION: "chat:notification",
    TYPING_START: "typing:start",
    TYPING_STOP: "typing:stop",
    USER_ONLINE_STATUS: "user:online_status",

    MESSAGE_SEND: "message:send",
    MESSAGE_NEW: "message:new",
    MESSAGE_READ: "message:read",
    MESSAGE_DELIVERED: "message:delivered",
    MESSAGE_STATUS_ALL: "message:status_all",
    MESSAGE_DELETED: "message:deleted",
    MESSAGE_EDITED: "message:edited",
    MESSAGE_SENT_ACKNOWLEDGEMENT: "message:sent_acknowledgement",

    ERROR: "error",
    CONNECT_ERROR: "connect_error",
} as const;

export type SOCKET_EVENT = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];

const SERVER_URL = "http://172.20.10.3:3000";
const MAX_AUTH_RETRIES = 2;

class SocketService {
    public socket: Socket | null = null;
    public isSocketConnected = false;

    private refreshing = false;
    private authRetries = 0;

    // The token argument is optional now: the socket always reads the latest one from storage
    connect(_accessToken?: string) {
        if (this.socket) {
            if (!this.socket.connected) this.socket.connect();
            return;
        }

        console.log("🔌 Connecting to Socket.io server at:", SERVER_URL);

        this.socket = io(SERVER_URL, {
            // Function form runs on EVERY connection attempt, so after a refresh
            // the reconnect automatically uses the new token.
            auth: (cb) => {
                SecureStore.getItemAsync("accessToken").then((token) => cb({ token }));
            },
            transports: ["websocket"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 10000,
        });

        this.socket.on(SOCKET_EVENTS.CONNECT, () => {
            this.isSocketConnected = true;
            this.authRetries = 0;
            console.log("🟢 Connected to Socket.io server:", this.socket?.id);
        });

        this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
            this.isSocketConnected = false;
            console.log("🔴 Disconnected from server:", reason);
        });

        this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, async (error) => {
            this.isSocketConnected = false;
            console.log("⚠️ Connection Error:", error.message);

            // Network errors keep retrying by themselves (socket.active === true).
            // When the server's auth middleware rejects the token, socket.io STOPS
            // retrying (socket.active === false), so we refresh and reconnect manually.
            if (this.socket && !this.socket.active) {
                await this.handleAuthError();
            }
        });
    }

    private async handleAuthError() {
        if (this.refreshing) return;
        if (this.authRetries >= MAX_AUTH_RETRIES) {
            console.log("🛑 Socket auth failed after refresh, giving up");
            return;
        }

        this.refreshing = true;
        this.authRetries++;
        try {
            await refreshSession();     // same shared refresh as axios
            this.socket?.connect();     // auth callback now reads the new token
        } catch (e) {
            // If the refresh token was rejected, refreshSession already cleared the
            // tokens and emitted auth-failed, which logs the user out like axios does.
            console.log("Socket token refresh failed:", e);
        } finally {
            this.refreshing = false;
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }
        this.isSocketConnected = false;
        this.authRetries = 0;
    }

    emit(event: string, data: any, callback?: Function) {
        if (this.socket?.connected) {
            if (callback) this.socket.emit(event, data, callback);
            else this.socket.emit(event, data);
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