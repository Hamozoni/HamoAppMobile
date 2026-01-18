import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios.config';
import * as SecureStore from 'expo-secure-store';
import { IDevice } from '../types/user.type';

interface VerifyOtpPayload {
    phoneNumber: string;
    otp: number;
    device: IDevice;
}

interface VerifyOtpResponse {
    message?: string,
    user: {
        id: string,
        phoneNumber: string
    },
    accessToken: string,
    refreshToken: string
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
