


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
    profilePictureFileId: {
        _id: string,
        secureUrl: string,
        publicId: string,
        createdAt: Date,
        updatedAt: Date
    },
    about: string,
    isPhoneVerified: boolean,
    createdAt: Date,
    updatedAt: Date
}
