import { axiosInstance } from "../../lib/axios.config";
import notificationService from "../../services/notification.service";
import { getDeviceInfo } from "../../utils/deviceInfo";


export async function sendTokenToServer(token: string) {
    const deviceIfo = await getDeviceInfo()
    await axiosInstance.post("/devices/push-token", deviceIfo);
}

export async function registerDevice() {
    const token = await notificationService.registerPushToken();
    if (!token) return null;
    await sendTokenToServer(token);
    return token;
}

/** Call on logout BEFORE deleting the auth tokens */
export async function unregisterDevice() {
    try {
        const deviceIfo = await getDeviceInfo()
        await axiosInstance.delete("/devices/push-token", { data: { deviceId: deviceIfo.deviceId } });
    } catch (e) {
        console.log("unregisterDevice failed (ignored):", e);
    }
}