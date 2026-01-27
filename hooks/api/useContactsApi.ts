import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.config";
import { IUser } from "../../types/user.type";


const getContacts = async (body: { phoneNumbers: string[] }): Promise<IUser[]> => {
    const { data } = await axiosInstance.post('/contacts/sync', body);
    return data;
};

export const useGetContacts = () => {

    return useMutation({
        mutationFn: getContacts,
    });
};