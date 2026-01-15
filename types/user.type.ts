


export interface IDevice {
    deviceId: string;
    platform?: string;
    deviceName: string;
    lastActive: Date;
    publicKey?: string;
    model?: any
};


export interface IUser {
    _id: string,
    phoneNumber: string,
    displayName: string,
    profilePicture: string,
    about: string,
    isPhoneVerified: boolean,
    createdAt: Date,
    updatedAt: Date
}
