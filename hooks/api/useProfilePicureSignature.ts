import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.config";


interface UploadMediaResponse {
    signature: string,
    timestamp: string,
    cloudName: string,
    apiKey: string,
    uploadUrl: string,
    folder: string,
    publicId: string,
    overwrite: string,
    invalidate: string,
}


const postUploadMedia = async (): Promise<UploadMediaResponse> => {
    const { data } = await axiosInstance.post(`/cloudinary/profile_picture_signature`);
    return data;
};

export const useProfilePictureSignature = () => {
    return useMutation({
        mutationFn: postUploadMedia,
    });
};

