import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.config";
import { CloudinarySignature } from "../../services/cloudinary.service";



export const useProfilePictureSignature = () => {
    const getProfilePictureSignature = async (payload: { endPoint: string, mediaType?: string }): Promise<CloudinarySignature> => {
        const { data } = await axiosInstance.post(payload.endPoint, { type: payload?.mediaType });
        return data;
    };
    return useMutation({
        mutationFn: getProfilePictureSignature,
    });
};

