
import { eq, and } from 'drizzle-orm';

import { db } from '../index';
import { chatParticipants, contacts } from '../schema';

import type { ParticipantInput } from './chats.repo';

// ============================================
// ADD ONE PARTICIPANT
// ============================================

export async function addParticipant(
    chatId: string,
    participant: ParticipantInput
) {
    const [result] = await db
        .insert(chatParticipants)
        .values({
            chatId,
            userId: participant.userId,
            role: participant.role,
        })
        .onConflictDoNothing()
        .returning();

    return result ?? null;
}

// ============================================
// ADD MANY PARTICIPANTS
// ============================================

export async function addParticipants(
    chatId: string,
    participants: ParticipantInput[]
) {
    if (participants.length === 0) return [];

    return db.transaction(async (tx) => {
        const result = [];

        const chunkSize = 100;

        for (let i = 0; i < participants.length; i += chunkSize) {
            const chunk = participants.slice(i, i + chunkSize);

            const inserted = await tx
                .insert(chatParticipants)
                .values(
                    chunk.map((participant) => ({
                        chatId,
                        userId: participant.userId,
                        role: participant.role,
                    }))
                )
                .onConflictDoNothing()
                .returning();

            result.push(...inserted);
        }

        return result;
    });
}

// ============================================
// GET PARTICIPANTS WITH CONTACTS
// ============================================

export async function getChatParticipants(chatId: string) {
    const result = await db
        .select({
            contact: contacts,
            role: chatParticipants.role,
            joinedAt: chatParticipants.joinedAt,
            leftAt: chatParticipants.leftAt,
        })
        .from(chatParticipants)
        .innerJoin(
            contacts,
            eq(chatParticipants.userId, contacts._id)
        )
        .where(eq(chatParticipants.chatId, chatId));

    return result.map((p) => ({
        ...p.contact,
        role: p.role,
        joinedAt: p.joinedAt,
        leftAt: p.leftAt,
    }));
}

// ============================================
// REMOVE ONE PARTICIPANT
// ============================================

export async function removeParticipant(
    chatId: string,
    userId: string
) {
    return db
        .delete(chatParticipants)
        .where(
            and(
                eq(chatParticipants.chatId, chatId),
                eq(chatParticipants.userId, userId)
            )
        )
        .returning();
}

// ============================================
// REMOVE ALL PARTICIPANTS
// ============================================

export async function removeAllParticipants(chatId: string) {
    return db
        .delete(chatParticipants)
        .where(eq(chatParticipants.chatId, chatId))
        .returning();
}

// ============================================
// UPDATE PARTICIPANT ADMIN
// ============================================

export async function setParticipantAdmin(
    chatId: string,
    userId: string,
    role: string
) {
    const [result] = await db
        .update(chatParticipants)
        .set({
            role: role,
        })
        .where(
            and(
                eq(chatParticipants.chatId, chatId),
                eq(chatParticipants.userId, userId)
            )
        )
        .returning();

    return result ?? null;
}

// ============================================
// GET PARTICIPANT
// ============================================

export async function getParticipant(
    chatId: string,
    userId: string
) {
    return db.query.chatParticipants.findFirst({
        where: and(
            eq(chatParticipants.chatId, chatId),
            eq(chatParticipants.userId, userId)
        ),
        with: {
            contact: true,
        },
    });
}
