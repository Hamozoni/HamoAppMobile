import { Platform } from "react-native";
import Constants from "expo-constants";

const isExpoGo = Constants.appOwnership === "expo";
const isAndroid = Platform.OS === "android";

// ✅ Only import on iOS or development builds
const Notifications = (!isAndroid || !isExpoGo)
    ? require("expo-notifications")
    : null;

// ✅ Set handler only if available
if (Notifications) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });
}

class NotificationService {

    async requestPermissions(): Promise<boolean> {
        if (!Notifications) return false;
        const { status: existing } = await Notifications.getPermissionsAsync();
        if (existing === "granted") return true;
        const { status } = await Notifications.requestPermissionsAsync();
        return status === "granted";
    }

    async registerPushToken(): Promise<string | null> {
        if (!Notifications) {
            console.log("⚠️ Push notifications not available in Expo Go Android");
            return null;
        }
        try {
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
            return null;
        }
    }

    async showMessageNotification(params: {
        senderName: string;
        messageText: string;
        chatId: string;
        phoneNumber: string;
    }) {
        if (!Notifications) return;
        try {
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
                trigger: null,
            });
        } catch (err) {
            console.error("Failed to show notification:", err);
        }
    }

    async clearBadge() {
        if (!Notifications) return;
        await Notifications.setBadgeCountAsync(0);
    }

    addNotificationResponseListener(
        callback: (chatId: string, phoneNumber: string) => void
    ) {
        if (!Notifications) return { remove: () => { } };
        return Notifications.addNotificationResponseReceivedListener(
            (response: any) => {
                const { chatId, phoneNumber } = response.notification.request.content.data;
                if (chatId && phoneNumber) callback(chatId, phoneNumber);
            }
        );
    }
}

export default new NotificationService();