import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import socketService, { SOCKET_EVENTS } from "../services/socket.service";
import { useSocketStore } from "./store/useSocketStore";

export function useSocketConnection() {
    const user = useAuthStore(state => state.user);
    const { setConnected, setUserTyping } = useSocketStore();

    useEffect(() => {
        if (!user) {
            // ✅ No user — disconnect and clean up
            socketService.disconnect();
            setConnected(false);
            return;
        }

        // ✅ User logged in — connect
        async function connect() {
            await socketService.connect();
            setConnected(socketService.isConnected());
        }

        connect();

        // ✅ Global event listeners
        socketService.on(SOCKET_EVENTS.CONNECT, () => {
            console.log("✅ Socket connected");
            setConnected(true);
        });

        socketService.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log("❌ Socket disconnected");
            setConnected(false);
        });

        socketService.on(SOCKET_EVENTS.TYPING_START, ({ chatId, userId }) => {
            setUserTyping(chatId, userId, true);
        });

        socketService.on(SOCKET_EVENTS.TYPING_STOP, ({ chatId, userId }) => {
            setUserTyping(chatId, userId, false);
        });

        return () => {
            // ✅ Clean up listeners on unmount
            socketService.off(SOCKET_EVENTS.CONNECT);
            socketService.off(SOCKET_EVENTS.DISCONNECT);
            socketService.off(SOCKET_EVENTS.TYPING_START);
            socketService.off(SOCKET_EVENTS.TYPING_STOP);
        };

    }, [user]); // ✅ Re-runs when user changes (login/logout)
}