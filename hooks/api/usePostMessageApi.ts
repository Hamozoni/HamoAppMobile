import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "../../lib/axios.config"
import { ILocalMessage } from "../../types/message.types"
import { useCloudinaryUpload } from "./useCloudinaryUplaod";
import { useMessagesStore } from "../store/useMessageStore";
import { useChatsStore } from "../store/useChatsStore";
import { useContactsStore } from "../store/useContactsStore";
import { Chat } from "../../types/components.types";
import { SOCKET_EVENTS, socketService } from "../../services/socket.service";

export const usePostMessage = ({ chatId, senderId, receiverId }: {
    chatId: string | null;
    senderId: string | undefined,
    receiverId: string
}) => {

    const { replaceOptimistic, updateMessageStatus, addMessage } = useMessagesStore()

    const { updateChat, addNewChat } = useChatsStore();
    const { registered } = useContactsStore()

    const { mutateAsync: uploadToCloudinary } = useCloudinaryUpload('/cloudinary/signature')

    return {
        ...useMutation({
            mutationFn: async ({ payload, asset, clientMessageId }: any): Promise<any> => {

                payload.chatId = chatId;
                payload.senderId = senderId;
                payload.receiverId = receiverId
                payload.createdAt = new Date();
                payload.updatedAt = new Date();

                const optimistic: ILocalMessage = {
                    clientMessageId,
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

                console.log({ payload, asset })
                if (asset) {

                    cloudinaryData = await uploadToCloudinary(asset)

                    if (!cloudinaryData) {
                        throw new Error("failed to upload media to cloudinary")
                    }

                }
                // const { data } = await axiosInstance.post('/messages', { payload, cloudinaryData });

                socketService.emit(SOCKET_EVENTS.MESSAGE_SEND, { payload, cloudinaryData, clientMessageId });

                return { success: true, clientMessageId }

            },
        })
    }
}