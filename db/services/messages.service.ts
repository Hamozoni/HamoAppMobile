
import { db } from '../index';
import { chats, messages, outbox } from '../schema';
import { eq } from 'drizzle-orm';

export const messageService = {
    // Send/create local message
    async sendMessage(params: {
        chatId: string;
        senderId: string;
        receiverId?: string;
        text?: string;
        type?: string;
        fileId?: string;
        localFileUri?: string;
        replyToId?: string;
    }) {
        const now = Date.now();
        const clientMessageId = crypto.randomUUID();

        const message = {
            clientMessageId,
            chatId: params.chatId,
            senderId: params.senderId,
            receiverId: params.receiverId,
            text: params.text ?? null,
            type: params.type ?? 'text',
            fileId: params.fileId ?? null,
            localFileUri: params.localFileUri ?? null,
            replyToId: params.replyToId ?? null,
            status: 'pending',
            createdAt: now,
            updatedAt: now,
        };

        await db.transaction(async (tx) => {
            // Insert message
            await tx.insert(messages).values(message);

            // Update chat preview
            await tx.update(chats)
                .set({
                    lastMessageId: clientMessageId,
                    lastMessageText: params.text ?? '',
                    lastMessageType: params.type ?? 'text',
                    lastMessageAt: now,
                    lastMessageSenderId: params.senderId,
                    lastMessageStatus: 'pending',
                    updatedAt: now,
                })
                .where(eq(chats.clientChatId, params.chatId));

            // Add to offline sending queue
            await tx.insert(outbox).values({
                clientMessageId,
                chatId: params.chatId,
                receiverId: params.receiverId,
                payload: JSON.stringify(message),
                status: 'pending',
                createdAt: now,
            });
        });

        return message;
    },

    // Get chat messages
    async getMessages(chatId: string, limit = 50) {
        const { messagesRepository } = await import('../repositories');

        const result = await messagesRepository.findByChat(chatId, limit);

        return result.reverse();
    },

    // Edit message
    async editMessage(id: string, text: string) {
        const { messagesRepository } = await import('../repositories');

        return messagesRepository.update(id, {
            text,
            isEdited: 1,
            editedAt: Date.now(),
            updatedAt: Date.now(),
        });
    },

    // Delete message locally (soft delete)
    async deleteMessage(id: string) {
        const { messagesRepository } = await import('../repositories');

        return messagesRepository.softDelete(id);
    },

    // Star message
    async starMessage(id: string, starred: boolean) {
        const { messagesRepository } = await import('../repositories');

        return messagesRepository.toggleStar(id, starred);
    },
};
