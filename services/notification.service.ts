import { Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
const isAndroid = Platform.OS === "android";
const CHANNEL_ID = "messages";

export interface NotificationTarget {
    chatId: string;
    senderId: string;
    phoneNumber: string;
}

let activeChatId: string | null = null;

// Foreground behavior: hide alerts for the chat the user is currently reading
Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
        const chatId = notification.request.content.data?.chatId;
        const hide = !!chatId && chatId === activeChatId;
        return {
            shouldShowBanner: !hide,
            shouldShowList: !hide,
            shouldPlaySound: !hide,
            shouldSetBadge: !hide,
        };
    },
});

class NotificationService {
    private channelReady = false;

    /** Call with the open chat id on focus, and null on blur/unmount */
    setActiveChat(chatId: string | null) {
        activeChatId = chatId;
    }

    private async ensureChannel() {
        if (!isAndroid || this.channelReady) return;
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
            name: "Messages",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#25D366",
            sound: "default",
        });
        this.channelReady = true;
    }

    async requestPermissions(): Promise<boolean> {
        await this.ensureChannel(); // channel must exist BEFORE the prompt on Android 13+
        const { status: existing } = await Notifications.getPermissionsAsync();
        if (existing === "granted") return true;
        const { status } = await Notifications.requestPermissionsAsync();
        return status === "granted";
    }

    /** Returns an Expo push token, or null when push isn't possible here */
    async registerPushToken(): Promise<string | null> {
        if (isExpoGo) {
            console.log("Remote push isn't available in Expo Go. Use a development build.");
            return null;
        }
        if (!Device.isDevice) {
            console.log("Push tokens need a physical device.");
            return null;
        }
        try {
            if (!(await this.requestPermissions())) return null;

            const projectId =
                Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
            if (!projectId) {
                console.warn("No EAS projectId. Run `eas init`.");
                return null;
            }
            const token = await Notifications.getExpoPushTokenAsync({ projectId });
            console.log("Push token:", token.data);
            return token.data;
        } catch (e) {
            console.error("Failed to get push token:", e);
            return null;
        }
    }

    /** Tokens can rotate: re-send the new one to the server */
    addPushTokenListener(callback: (token: string) => void) {
        if (isExpoGo) return { remove: () => { } };
        return Notifications.addPushTokenListener(async () => {
            const token = await this.registerPushToken();
            if (token) callback(token);
        });
    }

    /** Local notification: also works in Expo Go, handy for testing UI and navigation */
    async showLocalNotification(
        params: { title: string; body: string } & NotificationTarget,
        delaySeconds = 0
    ) {
        await this.requestPermissions();
        await Notifications.scheduleNotificationAsync({
            content: {
                title: params.title,
                body: params.body,
                sound: "default",
                data: { chatId: params.chatId, senderId: params.senderId, phoneNumber: params.phoneNumber },
            },
            trigger:
                delaySeconds > 0
                    ? { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: delaySeconds, channelId: CHANNEL_ID }
                    : isAndroid
                        ? { channelId: CHANNEL_ID }
                        : null,
        });
    }

    async clearBadge() {
        await Notifications.setBadgeCountAsync(0).catch(() => { });
        await Notifications.dismissAllNotificationsAsync().catch(() => { });
    }

    private parse(response: Notifications.NotificationResponse | null): NotificationTarget | null {
        const d: any = response?.notification.request.content.data;
        return d?.chatId && d?.senderId
            ? { chatId: String(d.chatId), senderId: String(d.senderId), phoneNumber: String(d.phoneNumber ?? "") }
            : null;
    }

    /** User taps a notification while the app is running or backgrounded */
    addResponseListener(callback: (target: NotificationTarget) => void) {
        return Notifications.addNotificationResponseReceivedListener((response) => {
            const target = this.parse(response);
            if (target) callback(target);
        });
    }

    /** Tap that launched the app from a killed state. Call once after login. */
    async getLaunchTarget(): Promise<NotificationTarget | null> {
        try {
            return this.parse(await Notifications.getLastNotificationResponseAsync());
        } catch {
            return null;
        }
    }
}

export default new NotificationService();