
import { eq, desc, and, lt } from 'drizzle-orm';
import { db } from '../index';
import { messages } from '../schema';

export const messagesRepository = {
    // Insert message
    async create(data: typeof messages.$inferInsert) {
        await db.insert(messages).values(data);

        return this.findById(data.clientMessageId);
    },

    // Get message by ID
    async findById(id: string) {
        const result = await db
            .select()
            .from(messages)
            .where(eq(messages.clientMessageId, id))
            .limit(1);

        return result[0] ?? null;
    },

    // Get messages for a chat
    async findByChat(chatId: string, limit = 50) {
        return db
            .select()
            .from(messages)
            .where(eq(messages.chatId, chatId))
            .orderBy(desc(messages.createdAt))
            .limit(limit);
    },

    // Pagination: older messages
    async findOlder(
        chatId: string,
        before: number,
        limit = 50
    ) {
        return db
            .select()
            .from(messages)
            .where(
                and(
                    eq(messages.chatId, chatId),
                    lt(messages.createdAt, before)
                )
            )
            .orderBy(desc(messages.createdAt))
            .limit(limit);
    },

    // Update message
    async update(
        id: string,
        data: Partial<typeof messages.$inferInsert>
    ) {
        await db
            .update(messages)
            .set(data)
            .where(eq(messages.clientMessageId, id));

        return this.findById(id);
    },

    // Delete message
    async delete(id: string) {
        return db
            .delete(messages)
            .where(eq(messages.clientMessageId, id));
    },

    // Delete all messages in chat
    async deleteByChat(chatId: string) {
        return db
            .delete(messages)
            .where(eq(messages.chatId, chatId));
    },

    // Star message
    async toggleStar(id: string, starred: boolean) {
        return this.update(id, {
            isStarred: starred ? 1 : 0,
        });
    },

    // Soft delete
    async softDelete(id: string) {
        return this.update(id, {
            isDeleted: 1,
            text: null,
        });
    },
};
