// src/hooks/useVerifyOtp.ts
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios.config';

interface VerifyOtpResponse {
    success?: boolean;
    message?: string;
    expiresIn?: number;
    error?: string;
}

const postOtp = async (phoneNumber: string): Promise<VerifyOtpResponse> => {
    const { data } = await axiosInstance.post('/auth/send_otp', { phoneNumber });
    return data;
};

export const useSendOpt = () => {
    return useMutation({
        mutationFn: postOtp,
    });
};
