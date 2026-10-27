import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useRouter } from "expo-router";
import notificationService, { type NotificationTarget } from "../services/notification.service";
import { registerDevice, sendTokenToServer } from "../hooks/api/useDeviceApi";
import { useAuthStore } from "./store/useAuthStore";

export function UseNotification() {

    const user = useAuthStore((s) => s.user);
    const router = useRouter();
    const handledLaunch = useRef(false);

    const openChat = (t: NotificationTarget) => {
        // Adjust to your chat details route. ChatDetails reads `contactId` (the other user's id).
        router.push({ pathname: "/chats/[contactId]" as any, params: { contactId: t.senderId } });
    };

    // Register the token and keep it fresh while logged in
    useEffect(() => {
        if (!user) return;
        registerDevice().catch(console.error);

        const sub = notificationService.addPushTokenListener((token) => {
            sendTokenToServer(token).catch(console.error);
        });
        return () => sub.remove();
    }, [user?._id]);

    // Taps while the app is running or in the background
    useEffect(() => {
        if (!user) return;
        const sub = notificationService.addResponseListener(openChat);
        return () => sub.remove();
    }, [user?._id]);

    // Tap that cold-started the app
    useEffect(() => {
        if (!user || handledLaunch.current) return;
        handledLaunch.current = true;
        notificationService.getLaunchTarget().then((t) => t && openChat(t));
    }, [user?._id]);

    // Clear the badge when the app comes to the foreground
    useEffect(() => {
        notificationService.clearBadge();
        const sub = AppState.addEventListener("change", (state) => {
            if (state === "active") notificationService.clearBadge();
        });
        return () => sub.remove();
    }, []);
    return null
}