import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "../../lib/axios.config"
import { ILocalMessage, SendMessagePayload } from "../../types/message.types"
import { useCloudinaryUpload } from "./useCloudinaryUplaod"

export const usePostMessage = () => {

    const { mutateAsync: uploadMediaToCloudinary, progress } = useCloudinaryUpload('/cloudinary/signature');

    return {
        ...useMutation({
            mutationFn: async (payload: SendMessagePayload): Promise<ILocalMessage> => {

                if (payload?.asset) {
                    const cloudinaryData = await uploadMediaToCloudinary(payload.asset);

                    if (!cloudinaryData) {
                        throw new Error("failed to upload media to cloudinary")
                    }

                    payload.asset = cloudinaryData


                }
                const { data } = await axiosInstance.post('/messages', { payload });

                return data;
            }
        }),
        progress
    }
}