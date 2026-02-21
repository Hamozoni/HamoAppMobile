
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios.config';
import { IUser } from '../../types/user.type';

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

interface IUpdateProfile {
    displayName: string,
    about: string,
}

const updateProfilePicture = async (payload: ICloudinaryData): Promise<IUser> => {
    const { data } = await axiosInstance.post('/profile/update-profile-picture', payload);
    return data;
};

export const useUpdateProfilePicture = () => {

    return useMutation({
        mutationFn: updateProfilePicture,
    });
};

const updateProfile = async (payload: IUpdateProfile): Promise<IUser> => {
    const { data } = await axiosInstance.post('/profile/update', payload);
    return data;
};


export const useUpdateProfile = () => {

    return useMutation({
        mutationFn: updateProfile,
    });
};

const getProfile = async (): Promise<IUser> => {
    const response = await axiosInstance.get('/profile');
    if (!response?.data) throw new Error("No profile data returned");
    return response.data;
};

export const useGetProfile = () => {

    return useMutation({
        mutationFn: getProfile,
    });
};