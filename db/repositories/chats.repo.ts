
import { eq, desc, and, sql } from 'drizzle-orm';

import { db } from '../index';
import { chats, chatParticipants } from '../schema';

import type { NewChat } from '../schema';

// ============================================
// TYPES
// ============================================

export type ParticipantInput = {
    userId: string; // contacts._id
    role?: string;
};

export type CreateChatInput = {
    chat: NewChat;
    participants: ParticipantInput[];
};

export type ChatWithParticipants = {
    chat: NewChat;
    participants: ParticipantInput[];
};

// ============================================
// INSERT ONE CHAT WITH PARTICIPANTS
// ============================================

export async function createChat(data: CreateChatInput) {
    return db.transaction(async (tx) => {

        // Insert chat
        const [chat] = await tx
            .insert(chats)
            .values(data.chat)
            .returning();

        // Insert participants
        if (data.participants.length > 0) {
            await tx
                .insert(chatParticipants)
                .values(
                    data.participants.map((participant) => ({
                        chatId: chat.clientChatId,
                        userId: participant.userId,
                        role: participant.role,
                    }))
                );
        }

        return chat;
    });
}

// ============================================
// INSERT MANY CHATS WITH PARTICIPANTS
// ============================================

export async function createManyChats(data: CreateChatInput[]) {
    if (data.length === 0) return [];

    return db.transaction(async (tx) => {

        const createdChats = [];
        const allParticipants = [];

        // Insert chats
        for (const item of data) {
            const [chat] = await tx
                .insert(chats)
                .values(item.chat)
                .returning();

            createdChats.push(chat);

            // Collect participants
            allParticipants.push(
                ...item.participants.map((participant) => ({
                    chatId: chat.clientChatId,
                    userId: participant.userId,
                    role: participant.role,
                }))
            );
        }

        // Bulk insert participants in chunks
        const chunkSize = 100;

        for (let i = 0; i < allParticipants.length; i += chunkSize) {
            const chunk = allParticipants.slice(i, i + chunkSize);

            await tx
                .insert(chatParticipants)
                .values(chunk);
        }

        return createdChats;
    });
}

// ============================================
// UPSERT ONE CHAT
// ============================================

export async function upsertChat(data: CreateChatInput) {
    return db.transaction(async (tx) => {

        const [chat] = await tx
            .insert(chats)
            .values(data.chat)
            .onConflictDoUpdate({
                target: chats.clientChatId,
                set: {
                    _id: data.chat._id,
                    isGroup: data.chat.isGroup,
                    peerId: data.chat.peerId,
                    groupName: data.chat.groupName,
                    groupAvatar: data.chat.groupAvatar,
                    lastMessageId: data.chat.lastMessageId,
                    lastMessageText: data.chat.lastMessageText,
                    lastMessageType: data.chat.lastMessageType,
                    lastMessageAt: data.chat.lastMessageAt,
                    lastMessageSenderId: data.chat.lastMessageSenderId,
                    lastMessageStatus: data.chat.lastMessageStatus,
                    updatedAt: data.chat.updatedAt,
                },
            })
            .returning();

        // Synchronize participants
        await tx
            .delete(chatParticipants)
            .where(eq(chatParticipants.chatId, chat.clientChatId));

        if (data.participants.length > 0) {
            await tx
                .insert(chatParticipants)
                .values(
                    data.participants.map((participant) => ({
                        chatId: chat.clientChatId,
                        userId: participant.userId,
                        role: participant.role,
                    }))
                );
        }

        return chat;
    });
}

// ============================================
// GET CHAT BY LOCAL ID
// ============================================

export async function getChatById(clientChatId: string) {
    const chat = await db.query.chats.findFirst({
        where: eq(chats.clientChatId, clientChatId),

        with: {
            peer: true,

            participants: {
                with: {
                    contact: true,
                },
            },
        },
    });

    if (!chat) return null;

    return {
        ...chat,

        participants: chat.participants
            .filter((p) => p.contact !== null)
            .map((p) => ({
                ...p.contact!,
                role: p.role,
                joinedAt: p.joinedAt,
                leftAt: p.leftAt,
            })),
    };
}

// ============================================
// GET CHAT BY SERVER ID
// ============================================

export async function getChatByServerId(serverId: string) {
    const chat = await db.query.chats.findFirst({
        where: eq(chats._id, serverId),

        with: {
            peer: true,

            participants: {
                with: {
                    contact: true,
                },
            },
        },
    });

    if (!chat) return null;

    return {
        ...chat,

        participants: chat.participants
            .filter((p) => p.contact !== null)
            .map((p) => ({
                ...p.contact!,
                role: p.role,
                joinedAt: p.joinedAt,
                leftAt: p.leftAt,
            })),
    };
}

// ============================================
// GET ALL CHATS
// ============================================

export async function getAllChats() {
    const result = await db.query.chats.findMany({
        with: {
            peer: true,

            participants: {
                with: {
                    contact: true,
                },
            },
        },

        orderBy: [
            desc(chats.lastMessageAt),
            desc(chats.createdAt),
        ],
    });

    return result.map((chat) => ({
        ...chat,

        participants: chat.participants
            .filter((p) => p.contact !== null)
            .map((p) => ({
                ...p.contact!,
                role: p.role,
                joinedAt: p.joinedAt,
                leftAt: p.leftAt,
            })),
    }));
}

// ============================================
// GET CHATS BY TYPE
// ============================================

export async function getChatsByType(isGroup: boolean) {
    const result = await db.query.chats.findMany({
        where: eq(chats.isGroup, isGroup ? 1 : 0),

        with: {
            peer: true,

            participants: {
                with: {
                    contact: true,
                },
            },
        },

        orderBy: desc(chats.lastMessageAt),
    });

    return result.map((chat) => ({
        ...chat,

        participants: chat.participants
            .filter((p) => p.contact !== null)
            .map((p) => ({
                ...p.contact!,
                role: p.role,
                joinedAt: p.joinedAt,
                leftAt: p.leftAt,
            })),
    }));
}

// ============================================
// GET PINNED CHATS
// ============================================

export async function getPinnedChats() {
    return db.query.chats.findMany({
        where: eq(chats.isPinned, 1),

        orderBy: desc(chats.lastMessageAt),

        with: {
            peer: true,
            participants: {
                with: {
                    contact: true,
                },
            },
        },
    });
}

// ============================================
// GET ARCHIVED CHATS
// ============================================

export async function getArchivedChats() {
    return db.query.chats.findMany({
        where: eq(chats.isArchived, 1),

        orderBy: desc(chats.lastMessageAt),

        with: {
            peer: true,
            participants: {
                with: {
                    contact: true,
                },
            },
        },
    });
}

// ============================================
// UPDATE CHAT
// ============================================

export async function updateChat(
    clientChatId: string,
    data: Partial<NewChat>
) {
    const [chat] = await db
        .update(chats)
        .set({
            ...data,
            updatedAt: Date.now(),
        })
        .where(eq(chats.clientChatId, clientChatId))
        .returning();

    return chat ?? null;
}

// ============================================
// PIN / UNPIN CHAT
// ============================================

export async function togglePinChat(
    clientChatId: string,
    isPinned: boolean
) {
    return updateChat(clientChatId, {
        isPinned: isPinned ? 1 : 0,
    });
}

// ============================================
// ARCHIVE / UNARCHIVE CHAT
// ============================================

export async function toggleArchiveChat(
    clientChatId: string,
    isArchived: boolean
) {
    return updateChat(clientChatId, {
        isArchived: isArchived ? 1 : 0,
    });
}

// ============================================
// MUTE / UNMUTE CHAT
// ============================================

export async function toggleMuteChat(
    clientChatId: string,
    isMuted: boolean,
    mutedUntil: number | null = null
) {
    return updateChat(clientChatId, {
        isMuted: isMuted ? 1 : 0,
        mutedUntil: isMuted ? mutedUntil : null,
    });
}

// ============================================
// DELETE CHAT
// ============================================

export async function deleteChat(clientChatId: string) {
    return db
        .delete(chats)
        .where(eq(chats.clientChatId, clientChatId))
        .returning();
}

