
import {
    chatsRepository,
    contactsRepository,
} from '../repositories';

import { db } from '../index';
import { chats, chatParticipants } from '../schema';

// import { eq } from 'drizzle-orm';

export const chatService = {
    // Create or get existing private chat
    async getOrCreatePrivateChat(peerId: string) {
        const existing = await chatsRepository.findPrivateChat(peerId);

        if (existing) return existing;

        const contact = await contactsRepository.findById(peerId);

        if (!contact) {
            throw new Error('Contact not found');
        }

        const clientChatId = crypto.randomUUID();

        await chatsRepository.create({
            clientChatId,
            peerId,
            isGroup: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return chatsRepository.findById(clientChatId);
    },

    // Create group chat
    async createGroup(
        groupName: string,
        participantIds: string[],
    ) {
        const clientChatId = crypto.randomUUID();

        await db.transaction(async (tx) => {
            await tx.insert(chats).values({
                clientChatId,
                groupName,
                isGroup: 1,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            await tx.insert(chatParticipants).values(
                participantIds.map(userId => ({
                    chatId: clientChatId,
                    userId,
                }))
            );
        });

        return chatsRepository.findById(clientChatId);
    },

    // Rename group
    async renameGroup(chatId: string, groupName: string) {
        return chatsRepository.update(chatId, {
            groupName,
        });
    },

    // Pin/unpin chat
    async togglePin(chatId: string, pinned: boolean) {
        return chatsRepository.update(chatId, {
            isPinned: pinned ? 1 : 0,
        });
    },

    // Archive/unarchive chat
    async toggleArchive(chatId: string, archived: boolean) {
        return chatsRepository.update(chatId, {
            isArchived: archived ? 1 : 0,
        });
    },

    // Mute/unmute chat
    async toggleMute(chatId: string, muted: boolean) {
        return chatsRepository.update(chatId, {
            isMuted: muted ? 1 : 0,
        });
    },

    // Delete chat
    async deleteChat(chatId: string) {
        return chatsRepository.delete(chatId);
    },

    // Get chat
    async getChat(chatId: string) {
        return chatsRepository.findById(chatId);
    },

    // Get all chats
    async getChats() {
        return chatsRepository.findAll();
    },
};
