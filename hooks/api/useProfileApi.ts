
import { useMutation, useQuery } from '@tanstack/react-query';
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
    cloudinaryData?: ICloudinaryData
}




export const useUpdateProfile = () => {

    const mutationFn = async (payload: IUpdateProfile): Promise<IUser> => {
        const { data } = await axiosInstance.post('/profile/update', payload);
        return data;
    };

    return useMutation({
        mutationFn,
    });
};


export const useGetProfile = (enabled: boolean) => {

    const getProfile = async (): Promise<IUser> => {
        const response = await axiosInstance.get('/profile');
        if (!response?.data) throw new Error("No profile data returned");
        return response.data;
    };
    return useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
        enabled
    });
};