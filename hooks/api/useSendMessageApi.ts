import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "../../lib/axios.config"


export const usePostMessage = () => {
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await axiosInstance.post('/messages', { payload })
            return data;
        }
    })
}