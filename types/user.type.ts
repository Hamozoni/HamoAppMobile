

export interface IUser {
    _id: string;
    phoneNumber: string;
    displayName?: string;
    profilePicture?: string;
    about?: string;
    isPhoneVerified: boolean;
    lastSeen: Date;
    createdAt: Date;
    updatedAt: Date;

    // Refresh tokens for multi-device support
    refreshTokens: IRefreshToken[];

    // Active devices
    devices: IDevice[];

    // Methods
    generateAccessToken(): string;
    generateRefreshToken(deviceId: string, deviceInfo: IDeviceInfo): string;
    cleanExpiredTokens(): void;
}

export interface IRefreshToken {
    token: string;
    deviceId: string;
    deviceInfo: IDeviceInfo;
    createdAt: Date;
    expiresAt: Date;
}

export interface IDevice {
    deviceId: string;
    platform?: string;
    deviceName: string;
    lastActive: Date;
    publicKey?: string; // For E2EE
}

export interface IDeviceInfo {
    platform: 'ios' | 'android' | 'web';
    deviceName: string;
    userAgent?: string;
    osVersion?: string;
}

export interface IOTP extends Document {
    phoneNumber: string;
    otp: string;
    attempts: number;
    verified: boolean;
    expiresAt: Date;
    createdAt: Date;
}

export interface IAuthRequest extends Request {
    user?: IUser;
    userId?: string;
}

export interface IJWTPayload {
    userId: string;
    phoneNumber: string;
    type?: 'access' | 'refresh';
    deviceId?: string;
}