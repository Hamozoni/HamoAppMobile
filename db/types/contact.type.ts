export interface Contact {
    _id: string;
    phoneNumber: string;
    countryCode: string | null;
    countryISO: string | null;
    displayName: string;
    about: string | null;
    profilePicture: string | null;
    isRegistered: 0 | 1;
}