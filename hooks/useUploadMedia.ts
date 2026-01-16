import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.config";

interface UploadMediaPayload {
    signature: string,
    timestamp: string,
    cloudName: string,
    apiKey: string,
    folder: string,
    resourceType: string,
    maxFileSize: string,
    publicId: string,
}

interface UploadMediaResponse {
    signature: string,
    timestamp: string,
    cloudName: string,
    apiKey: string,
    folder: string,
    resourceType: string,
    maxFileSize: string,
    publicId: string,
}


const postUploadMedia = async (payload: UploadMediaPayload): Promise<UploadMediaResponse> => {
    const { data } = await axiosInstance.post('/media/upload', payload);
    return data;
};

export const useUploadMedia = () => {
    return useMutation({
        mutationFn: postUploadMedia,
    });
};

