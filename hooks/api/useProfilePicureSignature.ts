import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.config";
import { CloudinarySignature } from "../../services/cloudinary.service";


const postUploadMedia = async (): Promise<CloudinarySignature> => {
    const { data } = await axiosInstance.post(`/cloudinary/profile_picture_signature`);
    return data;
};

export const useProfilePictureSignature = () => {
    return useMutation({
        mutationFn: postUploadMedia,
    });
};

