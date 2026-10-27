import { io, Socket } from "socket.io-client";



class SocketService {
    public socket: Socket | null = null;

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

        this.socket.on("connect", () => {
            console.log("🟢 Connected to Socket.io server:", this.socket?.id);
        });

        this.socket.on("disconnect", (reason) => {
            console.log("🔴 Disconnected from server:", reason);
        });

        this.socket.on("connect_error", (error) => {
            // If you see "Authentication token required" or "Authentication failed", check your token here
            console.log("⚠️ Connection Error:", error.message);
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