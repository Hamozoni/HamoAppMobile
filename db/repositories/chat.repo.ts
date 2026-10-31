import * as Crypto from "expo-crypto";
import { getDb } from "../index";
import { chunk, deleteByIds, deleteWhere, insertMany, insertOne, transaction, updateOne, type Db, type Row } from "../CRUD";

const ms = (v: unknown): number | null => (v ? new Date(v as string).getTime() : null);
const iso = (v: number | null | undefined) => (v ? new Date(v).toISOString() : null);
const pid = (p: any): string => (typeof p === "string" ? p : String(p._id));

// Mongo Maps arrive as plain objects over JSON (or Map instances); read either
const perUser = <T>(m: any, userId: string): T | undefined =>
    m instanceof Map ? m.get(userId) : m?.[userId];

const ph = (n: number) => Array(n).fill("?").join(",");

// ═════════════════════════════ identity helpers ═════════════════════════════

/** "chat key" = a clientChatId OR a server _id. Returns the clientChatId, or null if unknown. */
export async function resolveClientChatId(key: string, db?: Db): Promise<string | null> {
    const d = db ?? (await getDb());
    const r = await d.getFirstAsync<{ clientChatId: string }>(
        "SELECT clientChatId FROM chats WHERE clientChatId = ? OR _id = ? LIMIT 1",
        [key, key]
    );
    return r?.clientChatId ?? null;
}

/**
 * Make sure a local chat row exists for each SERVER chat id (a message can arrive over the socket
 * before the chat list is synced). Creates a minimal stub (clientChatId = _id) that saveChats() later fills in.
 * Returns serverChatId -> clientChatId.
 */
export async function ensureChats(d: Db, serverChatIds: string[]): Promise<Map<string, string>> {
    const unique = [...new Set(serverChatIds)];
    const map = new Map<string, string>();

    for (const part of chunk(unique)) {
        const rows = await d.getAllAsync<{ _id: string; clientChatId: string }>(
            `SELECT _id, clientChatId FROM chats WHERE _id IN (${ph(part.length)})`,
            part
        );
        rows.forEach((r) => map.set(r._id, r.clientChatId));
    }

    const now = Date.now();
    for (const id of unique) {
        if (map.has(id)) continue;
        await d.runAsync(
            "INSERT OR IGNORE INTO chats (clientChatId, _id, createdAt, updatedAt) VALUES (?, ?, ?, ?)",
            [id, id, now, now]
        );
        map.set(id, id);
    }
    return map;
}

// ═════════════════════════════ mapping ═════════════════════════════

/** Server chat JSON -> chats row (per-user Maps flattened for the signed-in user) */
export function chatToRow(chat: any, myId: string): Row {
    const participants: string[] = (chat.participants ?? []).map(pid);
    const avatar = chat.groupAvatar;
    return {
        clientChatId: chat.clientChatId ?? String(chat._id),
        _id: chat._id ? String(chat._id) : null,
        isGroup: chat.isGroup ? 1 : 0,
        peerId: chat.isGroup ? null : participants.find((p) => p !== myId) ?? null,
        groupName: chat.groupName ?? null,
        groupAvatar: avatar ? (typeof avatar === "object" ? avatar.secureUrl ?? pid(avatar) : String(avatar)) : null,

        lastMessageId: chat.lastMessageId ? String(chat.lastMessageId) : null,
        lastMessageText: chat.lastMessageText ?? null,
        lastMessageType: chat.lastMessageType ?? "text",
        lastMessageAt: ms(chat.lastMessageAt),
        lastMessageSenderId: chat.lastMessageSenderId ? String(chat.lastMessageSenderId) : null,
        lastMessageStatus: chat.lastMessageStatus ?? "sent",

        unreadCount: perUser<number>(chat.unreadCount, myId) ?? 0,
        isPinned: perUser<boolean>(chat.isPinned, myId) ? 1 : 0,
        isArchived: perUser<boolean>(chat.isArchived, myId) ? 1 : 0,
        isMuted: perUser<boolean>(chat.isMuted, myId) ? 1 : 0,
        mutedUntil: ms(perUser<string>(chat.mutedUntil, myId)),

        createdAt: ms(chat.createdAt) ?? Date.now(),
        updatedAt: ms(chat.updatedAt) ?? Date.now(),
    };
}

function rowToChat(r: any, participantIds: string[]) {
    return {
        _id: (r._id ?? r.clientChatId) as string,     // what the UI/stores already use as the chat id
        clientChatId: r.clientChatId as string,
        isGroup: !!r.isGroup,
        groupName: r.groupName ?? undefined,
        groupAvatar: r.groupAvatar ?? undefined,
        peerId: r.peerId ?? undefined,
        participants: participantIds.map((id) => ({ _id: id })),
        lastMessageId: r.lastMessageId ?? undefined,
        lastMessageText: r.lastMessageText ?? undefined,
        lastMessageType: r.lastMessageType,
        lastMessageAt: iso(r.lastMessageAt),
        lastMessageSenderId: r.lastMessageSenderId ?? undefined,
        lastMessageStatus: r.lastMessageStatus,
        unreadCount: r.unreadCount as number,
        isPinned: !!r.isPinned,
        isArchived: !!r.isArchived,
        isMuted: !!r.isMuted,
        mutedUntil: iso(r.mutedUntil),
        createdAt: iso(r.createdAt)!,
        updatedAt: iso(r.updatedAt)!,
    };
}
export type AppChat = ReturnType<typeof rowToChat>;

// ═════════════════════════════ CREATE ═════════════════════════════

/**
 * ONE or MANY server chats. For each: update the existing row (matched by server _id, or by peer for a direct chat
 * that was created locally and has no _id yet), otherwise insert. Participants are replaced. One transaction.
 */
export async function saveChats(chats: any[], myId: string, db?: Db) {
    if (!chats.length) return;

    const run = async (d: Db) => {
        const participantRows: Row[] = [];
        const clientIds: string[] = [];

        for (const chat of chats) {
            const row = chatToRow(chat, myId);

            const existing = await d.getFirstAsync<{ clientChatId: string }>(
                "SELECT clientChatId FROM chats WHERE _id = ? OR (_id IS NULL AND isGroup = 0 AND peerId = ?) LIMIT 1",
                [row._id, row.peerId]
            );
            const clientChatId = existing?.clientChatId ?? (row.clientChatId as string);

            if (existing) {
                const { clientChatId: _k, createdAt: _c, ...set } = row; // never rewrite the local key or createdAt
                await updateOne("chats", set, { clientChatId }, d);
            } else {
                await insertOne("chats", row, { db: d });
            }

            clientIds.push(clientChatId);
            const admins = new Set<string>((chat.groupAdmins ?? []).map(pid));
            for (const p of chat.participants ?? []) {
                participantRows.push({ chatId: clientChatId, userId: pid(p), isAdmin: admins.has(pid(p)) ? 1 : 0 });
            }
        }

        await deleteWhere("chatParticipants", { chatId: clientIds }, undefined, d);
        await insertMany("chatParticipants", participantRows, { orIgnore: true, db: d });
    };
    await (db ? run(db) : transaction(run));
}
export const saveChat = (chat: any, myId: string, db?: Db) => saveChats([chat], myId, db);

/** ONE: the direct chat with `peerId`, created locally if it doesn't exist (first message to a new contact) */
export async function getOrCreateDirectChat(peerId: string, myId: string) {
    return transaction(async (d) => {
        const existing = await d.getFirstAsync<{ clientChatId: string }>(
            "SELECT clientChatId FROM chats WHERE isGroup = 0 AND peerId = ? LIMIT 1",
            [peerId]
        );
        if (existing) return existing.clientChatId;

        const clientChatId = Crypto.randomUUID();
        await insertOne("chats", { clientChatId, isGroup: 0, peerId }, { db: d });
        await insertMany(
            "chatParticipants",
            [{ chatId: clientChatId, userId: myId, isAdmin: 0 }, { chatId: clientChatId, userId: peerId, isAdmin: 0 }],
            { orIgnore: true, db: d }
        );
        return clientChatId;
    });
}

// ═════════════════════════════ READ ═════════════════════════════

async function withParticipants(rows: any[]) {
    if (!rows.length) return [];
    const db = await getDb();
    const byChat = new Map<string, string[]>();
    for (const part of chunk(rows.map((r) => r.clientChatId as string))) {
        const parts = await db.getAllAsync<{ chatId: string; userId: string }>(
            `SELECT chatId, userId FROM chatParticipants WHERE chatId IN (${ph(part.length)})`,
            part
        );
        for (const p of parts) byChat.set(p.chatId, [...(byChat.get(p.chatId) ?? []), p.userId]);
    }
    return rows.map((r) => rowToChat(r, byChat.get(r.clientChatId) ?? []));
}

/** MANY: the chat list. Pinned first, then most recent activity. */
export async function getChats(opts: { archived?: boolean } = {}) {
    const db = await getDb();
    const rows = await db.getAllAsync(
        `SELECT * FROM chats WHERE isArchived = ?
     ORDER BY isPinned DESC, COALESCE(lastMessageAt, createdAt) DESC`,
        [opts.archived ? 1 : 0]
    );
    return withParticipants(rows);
}

/** ONE: by clientChatId or server _id */
export async function getChat(key: string) {
    const db = await getDb();
    const row = await db.getFirstAsync("SELECT * FROM chats WHERE clientChatId = ? OR _id = ? LIMIT 1", [key, key]);
    return row ? (await withParticipants([row]))[0]! : null;
}

/** ONE: the direct chat with a contact (what ChatDetails needs from `contactId`) */
export async function getChatByPeer(peerId: string) {
    const db = await getDb();
    const row = await db.getFirstAsync("SELECT * FROM chats WHERE isGroup = 0 AND peerId = ? LIMIT 1", [peerId]);
    return row ? (await withParticipants([row]))[0]! : null;
}

export async function getTotalUnread() {
    const db = await getDb();
    const r = await db.getFirstAsync<{ n: number }>("SELECT COALESCE(SUM(unreadCount), 0) AS n FROM chats WHERE isMuted = 0");
    return r?.n ?? 0;
}

// ═════════════════════════════ UPDATE ═════════════════════════════

/** ONE: refresh the preview after a message arrives/is sent; bump unread when it isn't the open chat */
export async function applyLastMessage(chatKey: string, message: any, opts: { incrementUnread?: boolean } = {}) {
    const db = await getDb();
    await db.runAsync(
        `UPDATE chats SET
       lastMessageId = ?, lastMessageText = ?, lastMessageType = ?, lastMessageAt = ?,
       lastMessageSenderId = ?, lastMessageStatus = ?,
       unreadCount = unreadCount + ?, updatedAt = ?
     WHERE clientChatId = ? OR _id = ?`,
        [
            message._id ? String(message._id) : message.clientMessageId ?? null,
            message.text ?? null,
            message.type ?? "text",
            ms(message.createdAt) ?? Date.now(),
            pid(message.senderId),
            message.status ?? "sent",
            opts.incrementUnread ? 1 : 0,
            Date.now(),
            chatKey,
            chatKey,
        ]
    );
}

export async function clearUnread(chatKey: string) {
    const db = await getDb();
    await db.runAsync("UPDATE chats SET unreadCount = 0 WHERE clientChatId = ? OR _id = ?", [chatKey, chatKey]);
}

/** ONE or MANY */
async function setFlag(column: "isPinned" | "isArchived" | "isMuted", chatKeys: string[], value: boolean) {
    if (!chatKeys.length) return;
    const db = await getDb();
    await db.runAsync(
        `UPDATE chats SET ${column} = ?, updatedAt = ? WHERE clientChatId IN (${ph(chatKeys.length)}) OR _id IN (${ph(chatKeys.length)})`,
        [value ? 1 : 0, Date.now(), ...chatKeys, ...chatKeys]
    );
}
export const setPinned = (keys: string[], v: boolean) => setFlag("isPinned", keys, v);
export const setArchived = (keys: string[], v: boolean) => setFlag("isArchived", keys, v);
export const setMuted = (keys: string[], v: boolean) => setFlag("isMuted", keys, v);

// ═════════════════════════════ DELETE ═════════════════════════════

/**
 * ONE or MANY by clientChatId. Participants are deleted explicitly (not via ON DELETE CASCADE: foreign_keys is a
 * per-connection setting and transactions may run on their own connection). A trigger removes the messages.
 */
export const deleteChats = (clientChatIds: string[]) =>
    transaction(async (txn) => {
        await deleteByIds("chatParticipants", "chatId", clientChatIds, txn);
        return deleteByIds("chats", "clientChatId", clientChatIds, txn);
    });