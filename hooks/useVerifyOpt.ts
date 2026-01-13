import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios.config';
import * as SecureStore from 'expo-secure-store';
import { IDevice } from '../types/user.type';
interface VerifyOtpPayload {
    phoneNumber: string;
    otp: number;
    deviceInfo: IDevice;
}

interface VerifyOtpResponse {
    success: true,
    isNewUser: boolean,
    accessToken: string,
    refreshToken: string,
    deviceId: string,
    user: {
        id: string,
        phoneNumber: string,
        displayName: string,
        profilePicture: string,
        about: string,
        isPhoneVerified: boolean,
        createdAt: Date
    }
}

const postVerifyOtp = async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    const { data } = await axiosInstance.post('/auth/verify_otp', payload);
    return data;
};

export const useVerifyOtp = () => {

    return useMutation({
        mutationFn: postVerifyOtp,
        onSuccess: (data) => {
            SecureStore.setItemAsync('accessToken', data.accessToken);
            SecureStore.setItemAsync('refreshToken', data.refreshToken);
        },
    });
};
