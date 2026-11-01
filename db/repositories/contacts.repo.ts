
import { eq, like, or, and, sql } from 'drizzle-orm';
import { db } from '../index';
import { contacts } from '../schema';

export const contactsRepository = {
    // Insert one contact
    async create(data: typeof contacts.$inferInsert) {
        await db.insert(contacts).values(data);

        return this.findById(data._id);
    },

    // Insert multiple contacts
    async createMany(data: (typeof contacts.$inferInsert)[]) {
        if (!data.length) return;

        await db.insert(contacts).values(data)
            .onConflictDoUpdate({
                target: contacts.phoneNumber,
                set: {
                    countryCode: sql`excluded."countryCode"`,
                    _id: sql`excluded."_id"`,
                    countryISO: sql`excluded."countryISO"`,
                    displayName: sql`excluded."displayName"`,
                    about: sql`excluded."about"`,
                    profilePicture: sql`excluded."profilePicture"`,
                },
            });
    },

    // Get all contacts
    async findAll() {
        return db.select().from(contacts);
    },

    // Find contact by ID
    async findById(id: string) {
        const result = await db
            .select()
            .from(contacts)
            .where(eq(contacts._id, id))
            .limit(1);

        return result[0] ?? null;
    },

    // Find by phone number
    async findByPhone(phoneNumber: string) {
        const result = await db
            .select()
            .from(contacts)
            .where(eq(contacts.phoneNumber, phoneNumber))
            .limit(1);

        return result[0] ?? null;
    },

    // Search contacts
    async search(query: string) {
        return db
            .select()
            .from(contacts)
            .where(
                or(
                    like(contacts.displayName, `%${query}%`),
                    like(contacts.phoneNumber, `%${query}%`)
                )
            );
    },

    // Get registered contacts
    async findRegistered() {
        return db
            .select()
            .from(contacts)
            .where(
                eq(contacts.isRegistered, 1)
            )
    },

    // Get registered contacts
    async findUnRegistered() {
        return db
            .select()
            .from(contacts)
            .where(

                eq(contacts.isRegistered, 0),

            )
    },

    // Update contact
    async update(
        id: string,
        data: Partial<typeof contacts.$inferInsert>
    ) {
        await db
            .update(contacts)
            .set(data)
            .where(eq(contacts._id, id));

        return this.findById(id);
    },

    async updateMany(
        id: string,
        data: Partial<typeof contacts.$inferInsert>
    ) {
        await db
            .update(contacts)
            .set(data)
            .where(eq(contacts._id, id));

        return this.findById(id);
    },

    // Delete contact
    async delete(id: string) {
        return db
            .delete(contacts)
            .where(eq(contacts._id, id));
    },

    // Delete all contacts
    async deleteAll() {
        return db.delete(contacts);
    },
};
