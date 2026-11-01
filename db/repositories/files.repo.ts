
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { files } from '../schema';

export const filesRepository = {

    async create(data: typeof files.$inferInsert) {
        await db.insert(files).values(data);
    },

    async findById(id: string) {
        const result = await db
            .select()
            .from(files)
            .where(eq(files.clientFileId, id))
            .limit(1);

        return result[0] ?? null;
    },

    async findAll() {
        return db.select().from(files);
    },

    async update(
        id: string,
        data: Partial<typeof files.$inferInsert>
    ) {
        return db
            .update(files)
            .set(data)
            .where(eq(files.clientFileId, id));
    },

    async delete(id: string) {
        return db
            .delete(files)
            .where(eq(files.clientFileId, id));
    },
};
