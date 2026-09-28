


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
    about: string,
    profilePicture: {
        _id: string,
        secureUrl: string,
        publicId: string,
    },
}
