import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "../../lib/axios.config"
import { ILocalMessage } from "../../types/message.types"
import { useCloudinaryUpload } from "./useCloudinaryUplaod";
import * as Crypto from "expo-crypto";
import { useMessagesStore } from "../store/useMessageStore";
import { useChatsStore } from "../store/useChatsStore";
import { useContactsStore } from "../store/useContactsStore";
import { Chat } from "../../types/components.types";

export const usePostMessage = ({ chatId, senderId, receiverId }: {
    chatId: string | null;
    senderId: string | undefined,
    receiverId: string
}) => {

    const { mutateAsync: uploadMediaToCloudinary, progress } = useCloudinaryUpload('/cloudinary/signature');
    const { addMessage, replaceOptimistic } = useMessagesStore();
    const { updateChat, addNewChat } = useChatsStore();
    const { registered } = useContactsStore()

    return {
        ...useMutation({
            mutationFn: async ({ payload, asset }: any): Promise<ILocalMessage> => {

                const clientMessageId = Crypto.randomUUID();
                payload.chatId = chatId;
                payload.senderId = senderId;
                payload.receiverId = receiverId
                payload.createdAt = new Date();
                payload.updatedAt = new Date();

                const optimistic: ILocalMessage = {
                    _id: clientMessageId,
                    ...payload,
                    status: 'pending',
                    isOptimistic: true,
                    ...(asset && { file: { _id: clientMessageId, secureUrl: asset.uri, type: payload.type, metadata: {} } }),
                    ...(payload.location && { location: payload.location }),
                    ...(payload.contact && { contact: payload.contact }),
                    ...(payload.replyTo && { replyTo: payload.replyTo }),
                };

                addMessage(payload.chatId || receiverId, optimistic);


                const lastMessage = {
                    lastMessageText: payload.text ?? null,
                    lastMessageType: payload.type,
                    lastMessageAt: payload.createdAt,
                    lastMessageSenderId: payload.senderId,
                    lastMessageId: payload._id,
                    lastMessageStatus: "pending"
                }

                if (!chatId) {
                    const conctact = registered.find(e => e._id === payload.receiverId)
                    const newChat: Chat = {
                        ...lastMessage,
                        _id: payload.phoneNumber,
                        participants: [conctact],
                        createdAt: payload.createdAt,
                        updatedAt: payload.updatedAt,
                        isGroup: false
                    }

                    addNewChat(newChat);

                } else {
                    updateChat(payload.chatId, lastMessage);
                }

                let cloudinaryData = null

                if (asset) {
                    cloudinaryData = await uploadMediaToCloudinary(asset);


                    if (!cloudinaryData) {
                        throw new Error("failed to upload media to cloudinary")
                    }


                }
                const { data } = await axiosInstance.post('/messages', { payload, cloudinaryData });

                replaceOptimistic(data.message.chatId, clientMessageId, data.message);
                updateChat(payload.chatId, { lastMessageStatus: data.message.status });



                return data;
            },
        }),
        progress
    }
}