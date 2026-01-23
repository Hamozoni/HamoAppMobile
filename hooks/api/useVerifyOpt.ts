import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios.config';
import { IDevice } from '../types/user.type';
import tokenService from '../services/tokenService';

interface VerifyOtpPayload {
    phoneNumber: string;
    otp: number;
    countryCode: string;
    device: IDevice;
}

interface VerifyOtpResponse {
    message?: string,
    user: {
        _id: string,
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
    });
};
