// src/utils/deviceInfo.ts
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { Platform } from 'react-native'; // Need to detect OS for correct API call
import { IDevice } from '../types/user.type';

export const getDeviceInfo = async (): Promise<IDevice> => {
    let deviceId: string | null = 'unknown';

    console.log(Device);

    // 1. Correctly get the device ID based on platform
    if (Platform.OS === 'android') {
        // getAndroidId() is a synchronous function, not a property [citation:1].
        // It can return null if the ID is unavailable.
        deviceId = Application.getAndroidId();
    } else if (Platform.OS === 'ios') {
        // getIosIdForVendorAsync() is an asynchronous method [citation:1].
        // It can return null if the device has been restarted and not unlocked.
        deviceId = await Application.getIosIdForVendorAsync();
    }

    // 2. The 'platform' should come from Device.osName, not a hardcoded string [citation:3]
    return {
        deviceId: deviceId || 'unknown', // Handle cases where the ID is null
        platform: Device.osName || 'unknown', // Get the OS name like "Android" or "iOS" [citation:3]
        deviceName: Device.deviceName || 'unknown', // This is correct [citation:3]
        lastActive: new Date(),
        publicKey: undefined,
        model: Device.modelName,
    };
};
