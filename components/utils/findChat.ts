import { useChatsStore } from "../../hooks/store/useChatsStore"

const { chats } = useChatsStore();

export const findChatById = (chatId: string) => {
    if (!chats) return null;
    return chats.find(chat => chat._id === chatId);
};

