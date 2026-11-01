
import { db } from '../index';
import { syncState } from '../schema';
import { eq } from 'drizzle-orm';

export const syncService = {
    async getLastSync(key: string) {
        const result = await db
            .select()
            .from(syncState)
            .where(eq(syncState.key, key))
            .limit(1);

        return result[0]?.value ?? null;
    },

    async updateLastSync(key: string, value: string) {
        await db
            .insert(syncState)
            .values({ key, value })
            .onConflictDoUpdate({
                target: syncState.key,
                set: { value },
            });
    },

    async syncMessages() {
        // 1. Get last sync cursor.
        // 2. Request new messages from backend.
        // 3. Insert/update messages locally.
        // 4. Update chat previews and unread counts.
        // 5. Save the new sync cursor.
        //
        // Connect your API client here.
    },

    async syncContacts() {
        // Fetch contacts from backend.
        // Upsert them into local SQLite.
    },
};
