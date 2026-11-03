
import { eq, desc, and, sql } from 'drizzle-orm';
import { db } from '../index';
import { chats, chatParticipants, messages } from '../schema';

export const chatsRepository = {
    // Create chat
    async create(data: typeof chats.$inferInsert) {
        await db.insert(chats).values(data);

        return this.findById(data.clientChatId);
    },

    // Insert multiple chats
    async createMany(data: (typeof chats.$inferInsert)[]) {
        if (!data.length) return;

        await db.insert(chats).values(data)
            .onConflictDoUpdate({
                target: chats.clientChatId,
                set: {
                    _id: sql`excluded."_id"`,
                    lastMessageAt: sql`excluded."lastMessageAt"`,
                    unreadCount: sql`excluded."unreadCount"`,
                    lastMessageId: sql`excluded."lastMessageId"`,
                    lastMessageStatus: sql`excluded."lastMessageStatus"`,
                    lastMessageType: sql`excluded."lastMessageType"`,
                    lastMessageText: sql`excluded."lastMessageText"`,
                },
            });
    },



    // Get chat by ID
    async findById(id: string) {
        const result = await db
            .select()
            .from(chats)
            .where(eq(chats.clientChatId, id))
            .limit(1);

        return result[0] ?? null;
    },

    // Get private chat by peer ID
    async findPrivateChat(peerId: string) {
        const result = await db
            .select()
            .from(chats)
            .where(
                and(
                    eq(chats.peerId, peerId),
                    eq(chats.isGroup, 0)
                )
            )
            .limit(1);

        return result[0] ?? null;
    },

    // Get all chats ordered by latest message
    async findAll() {
        return db
            .select()
            .from(chats)
            .orderBy(desc(chats.lastMessageAt));
    },

    // Get chats with unread messages
    async findUnread() {
        return db
            .select()
            .from(chats)
            .where(eq(chats.unreadCount, 1));
    },

    // Update chat
    async update(
        id: string,
        data: Partial<typeof chats.$inferInsert>
    ) {
        await db
            .update(chats)
            .set({
                ...data,
                updatedAt: Date.now(),
            })
            .where(eq(chats.clientChatId, id));

        return this.findById(id);
    },

    // Delete chat
    async delete(id: string) {
        return db
            .delete(chats)
            .where(eq(chats.clientChatId, id));
    },

    // Add participants
    async addParticipants(
        chatId: string,
        userIds: string[]
    ) {
        if (!userIds.length) return;

        return db
            .insert(chatParticipants)
            .values(
                userIds.map(userId => ({
                    chatId,
                    userId,
                }))
            )
            .onConflictDoNothing();
    },

    // Get participants
    async findParticipants(chatId: string) {
        return db
            .select()
            .from(chatParticipants)
            .where(eq(chatParticipants.chatId, chatId));
    },
};
