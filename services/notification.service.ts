import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
// ✅ How notifications appear when app is foregrounded
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

class NotificationService {

    async requestPermissions(): Promise<boolean> {
        const { status: existing } = await Notifications.getPermissionsAsync();
        if (existing === "granted") return true;

        const { status } = await Notifications.requestPermissionsAsync();
        return status === "granted";
    }

    async registerPushToken(): Promise<string | null> {
        try {
            // ✅ Skip on Android Expo Go — not supported in SDK 53+
            const isExpoGo = Constants.appOwnership === "expo";
            if (Platform.OS === "android" && isExpoGo) {
                console.log("⚠️ Push notifications not supported in Expo Go Android — skipping");
                return null;
            }

            const granted = await this.requestPermissions();
            if (!granted) return null;

            const projectId =
                Constants.expoConfig?.extra?.eas?.projectId ??
                Constants.easConfig?.projectId;

            if (!projectId) {
                console.warn("⚠️ No projectId — skipping push token");
                return null;
            }

            const token = await Notifications.getExpoPushTokenAsync({ projectId });
            console.log("📲 Push token:", token.data);
            return token.data;
        } catch (err) {
            console.error("Failed to get push token:", err);
            return null;  // ✅ don't crash app if this fails
        }
    }

    async showMessageNotification(params: {
        senderName: string;
        messageText: string;
        chatId: string;
        phoneNumber: string;
        avatar?: string;
    }) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: params.senderName,
                body: params.messageText,
                sound: true,
                data: {
                    chatId: params.chatId,
                    phoneNumber: params.phoneNumber,
                },
            },
            trigger: null, // ✅ show immediately
        });
    }

    // ✅ Clear badge count
    async clearBadge() {
        await Notifications.setBadgeCountAsync(0);
    }

    // ✅ Listen for notification taps
    addNotificationResponseListener(
        callback: (chatId: string, phoneNumber: string) => void
    ) {
        return Notifications.addNotificationResponseReceivedListener(response => {
            const { chatId, phoneNumber } = response.notification.request.content.data as any;
            if (chatId && phoneNumber) {
                callback(chatId, phoneNumber);
            }
        });
    }
}

export default new NotificationService();