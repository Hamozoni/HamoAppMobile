import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.config";
import { CloudinarySignature } from "../../services/cloudinary.service";


const getProfilePictureSignature = async (payload: { endPoint: string, mediaType?: string }): Promise<CloudinarySignature> => {
    const { data } = await axiosInstance.post(payload.endPoint, { type: payload?.mediaType });
    return data;
};

export const useProfilePictureSignature = () => {
    return useMutation({
        mutationFn: getProfilePictureSignature,
    });
};

