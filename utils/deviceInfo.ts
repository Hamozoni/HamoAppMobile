// src/utils/deviceInfo.ts
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { IDevice } from '../types/user.type';


export const getDeviceInfo = async (): Promise<IDevice> => {
    // For Android, use Installation ID. For iOS, you may need a different strategy.
    const deviceId = Application.getAndroidId() || (await Application.getIosIdForVendorAsync());

    return {
        deviceId: deviceId || 'unknown',
        platform: Device.osName || 'unknown',
        deviceName: Device.deviceName || 'unknown',
        lastActive: new Date(),
        publicKey: undefined,
    };
};
