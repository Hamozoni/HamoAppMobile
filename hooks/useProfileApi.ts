
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios.config';
import type { IUser } from '../types/user.type';

interface ICloudinaryData {
    public_id: string,
    secure_url: string,
    width: number,
    height: number,
    size: number,
    format: string,
    mimeType: string,
    resource_type: string
}

const updateProfile = async (payload: ICloudinaryData): Promise<IUser> => {
    const { data } = await axiosInstance.post('/profile/update-profile-picture', payload);
    return data;
};

export const useUpdateProfile = () => {

    return useMutation({
        mutationFn: updateProfile,
    });
};