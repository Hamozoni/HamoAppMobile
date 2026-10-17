import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.config";
import { ILocalMessage } from "../../types/message.types";
import { useMessagesStore } from "../store/useMessageStore";

// 1. Accept chatId as a parameter to the hook
export const useGetmessages = (chatId: string | undefined) => {
    const { setMessages } = useMessagesStore();

    return useQuery({
        // 2. Include chatId in the queryKey so it refetches when switching chats
        queryKey: ['messages', chatId],

        // 3. Destructure queryKey to get the chatId passed into the fetcher function
        queryFn: async ({ queryKey }): Promise<ILocalMessage[]> => {
            const [, id] = queryKey;
            const { data } = await axiosInstance.get(`/messages/${id}`);

            console.log("✅ Messages fetched:", data.messages.length);
            setMessages(id, data.messages);
            return data.messages;
        },

        // 4. (Optional) Only run the query if a chatId actually exists
        enabled: !!chatId,
    });
};