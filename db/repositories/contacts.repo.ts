
import { and, sql } from 'drizzle-orm';

import { db } from '../index';
import { contacts } from '../schema';

import type { NewContact } from '../schema';

// ============================================
// INSERT ONE CONTACT
// ============================================

export async function createContact(data: NewContact) {
    const [contact] = await db
        .insert(contacts)
        .values(data)
        .returning();

    return contact;
}

// ============================================
// INSERT MANY CONTACTS
// ============================================

export async function createManyContacts(data: NewContact[]) {
    if (data.length === 0) return [];

    return db
        .insert(contacts)
        .values(data)
        .returning();
}

// ============================================
// UPSERT ONE CONTACT
// ============================================

export async function upsertContact(data: NewContact) {
    const [contact] = await db
        .insert(contacts)
        .values(data)
        .onConflictDoUpdate({
            target: contacts._id,
            set: {
                phoneNumber: data.phoneNumber,
                countryCode: data.countryCode,
                countryISO: data.countryISO,
                displayName: data.displayName,
                about: data.about,
                profilePicture: data.profilePicture,
                isRegistered: data.isRegistered,
                isInMycontacts: data.isInMycontacts,
            },
        })
        .returning();

    return contact;
}

// ============================================
// UPSERT MANY CONTACTS
// ============================================

export async function upsertManyContacts(data: NewContact[]) {
    if (data.length === 0) return [];

    const chunkSize = 50;
    const result = [];

    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);

        const inserted = await db
            .insert(contacts)
            .values(chunk)
            .onConflictDoUpdate({
                target: contacts._id,
                set: {
                    phoneNumber: sql`excluded.phoneNumber`,
                    countryCode: sql`excluded.countryCode`,
                    countryISO: sql`excluded.countryISO`,
                    displayName: sql`excluded.displayName`,
                    about: sql`excluded.about`,
                    profilePicture: sql`excluded.profilePicture`,
                    isRegistered: sql`excluded.isRegistered`,
                    isInMycontacts: sql`excluded.isInMycontacts`,
                },
            })
            .returning();

        result.push(...inserted);
    }

    return result;
}

// ============================================
// GET CONTACT BY SERVER ID
// ============================================

export async function getContactById(id: string) {
    return db.query.contacts.findFirst({
        where: (contacts, { eq }) =>
            eq(contacts._id, id),
    });
};

export async function getUnRegisteredContacts() {
    return db.query.contacts.findMany({
        where: (contacts, { eq }) =>
            eq(contacts.isRegistered, 0)
    });
};

export async function getRegisteredContacts() {
    return db.query.contacts.findMany({
        where: (contacts, { eq }) =>
            eq(contacts.isRegistered, 1)
    });
}

// ============================================
// GET CONTACT BY PHONE NUMBER
// ============================================

export async function getContactByPhone(phoneNumber: string) {
    return db.query.contacts.findFirst({
        where: (contacts, { eq }) =>
            eq(contacts.phoneNumber, phoneNumber),
    });
}

// ============================================
// GET ALL CONTACTS
// ============================================

export async function getAllContacts() {
    return db.query.contacts.findMany({
        orderBy: (contacts, { asc }) => [
            asc(contacts.displayName),
        ],
    });
}

// ============================================
// DELETE CONTACT
// ============================================

export async function deleteContact(id: string) {
    return db
        .delete(contacts)
        .where(sql`${contacts._id} = ${id}`)
        .returning();
}
