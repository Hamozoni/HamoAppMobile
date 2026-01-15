
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios.config';
import type { IUser } from '../types/user.type';

interface UpdateProfilePayload {
    displayName: string,
    profilePicture: string,
    about: string,
}

const updateProfile = async (payload: UpdateProfilePayload): Promise<IUser> => {
    const { data } = await axiosInstance.post('/profile/update', payload);
    return data;
};

export const useUpdateProfile = () => {

    return useMutation({
        mutationFn: updateProfile,
    });
};