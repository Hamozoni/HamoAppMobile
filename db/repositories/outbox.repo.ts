
import { eq, lte, asc } from 'drizzle-orm';
import { db } from '../index';
import { outbox } from '../schema';

export const outboxRepository = {
    async create(data: typeof outbox.$inferInsert) {
        return db.insert(outbox).values(data);
    },

    async findPending() {
        return db
            .select()
            .from(outbox)
            .where(eq(outbox.status, 'pending'))
            .orderBy(asc(outbox.createdAt));
    },

    async findReadyToRetry(now: number) {
        return db
            .select()
            .from(outbox)
            .where(
                lte(outbox.nextAttemptAt, now)
            )
            .orderBy(asc(outbox.createdAt));
    },

    async update(
        id: string,
        data: Partial<typeof outbox.$inferInsert>
    ) {
        return db
            .update(outbox)
            .set(data)
            .where(eq(outbox.clientMessageId, id));
    },

    async delete(id: string) {
        return db
            .delete(outbox)
            .where(eq(outbox.clientMessageId, id));
    },
};
