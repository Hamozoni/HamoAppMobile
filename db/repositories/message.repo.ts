import type { SQLiteBindValue } from "expo-sqlite";
import { getDb } from "../index";
import { chunk, deleteByIds, deleteWhere, transaction, updateOne, upsertMany, type Db, type Row } from "../CRUD";
import { ensureChats, resolveClientChatId } from "./chat.repo";

// ───────────── status only moves forward (never read -> delivered) ─────────────
export type MessageStatus = "pending" | "sent" | "delivered" | "read" | "failed";
const STATUS_RANK: Record<MessageStatus, number> = { pending: 0, failed: 0, sent: 1, delivered: 2, read: 3 };
const rankSql = (col: string) =>
    `(CASE ${col} WHEN 'sent' THEN 1 WHEN 'delivered' THEN 2 WHEN 'read' THEN 3 ELSE 0 END)`;

const ph = (n: number) => Array(n).fill("?").join(",");
const ms = (v: unknown): number | null => (v ? new Date(v as string).getTime() : null);
const iso = (v: number | null | undefined) => (v ? new Date(v).toISOString() : undefined);
const idOf = (v: any): string | null =>
    v ? (typeof v === "object" ? String(v._id ?? v.id ?? "") || null : String(v)) : null;

/** SELECT keyCol -> valCol for a list of keys (chunked) */
async function lookup(d: Db, table: string, keyCol: string, valCol: string, keys: string[]) {
    const map = new Map<string, string>();
    for (const part of chunk([...new Set(keys)])) {
        const rows = await d.getAllAsync<{ k: string; v: string }>(
            `SELECT ${keyCol} AS k, ${valCol} AS v FROM ${table} WHERE ${keyCol} IN (${ph(part.length)})`,
            part
        );
        rows.forEach((r) => map.set(r.k, r.v));
    }
    return map;
}

// ═════════════════════════════ mapping ═════════════════════════════

/** Server message -> messages row. `ctx` carries the already-resolved LOCAL chat and file keys. */
export function messageToRow(m: any, ctx: { clientChatId: string; clientFileId?: string | null }): Row {
    const now = Date.now();
    return {
        clientMessageId: m.clientMessageId ?? String(m._id),   // fallback when the server did not echo one
        _id: m._id ? String(m._id) : null,
        chatId: ctx.clientChatId,
        senderId: idOf(m.senderId)!,
        receiverId: idOf(m.receiverId),
        type: m.type ?? "text",
        status: m.status ?? "sent",
        text: m.text ?? null,
        fileId: ctx.clientFileId ?? null,
        localFileUri: m.localFileUri ?? null,
        latitude: m.location?.latitude ?? null,
        longitude: m.location?.longitude ?? null,
        locationName: m.location?.name ?? null,
        link: m.link ? JSON.stringify(m.link) : null,
        replyToId: idOf(m.replyTo),
        isDeleted: m.isDeleted ? 1 : 0,
        isEdited: m.isEdited ? 1 : 0,
        editedAt: ms(m.editedAt),
        isStarred: m.isStarred ? 1 : 0,
        createdAt: ms(m.createdAt) ?? now,
        updatedAt: ms(m.updatedAt) ?? now,
    };
}

/** Server populated `file` -> files row (clientFileId defaults to the server _id) */
export function fileToRow(f: any): Row {
    const md = f.metadata ?? {};
    return {
        clientFileId: String(f._id),
        _id: String(f._id),
        type: f.type,
        purpose: f.purpose ?? null,
        resourceType: f.resourceType ?? null,
        secureUrl: f.secureUrl ?? null,
        thumbnailUrl: f.thumbnailUrl ?? null,
        size: md.size ?? null,
        mimeType: md.mimeType ?? null,
        format: md.format ?? null,
        width: md.width ?? null,
        height: md.height ?? null,
        duration: md.duration ?? null,
        pages: md.pages ?? null,
        metadata: JSON.stringify(md),
        expiresAt: ms(f.expiresAt),
        createdAt: ms(f.createdAt) ?? Date.now(),
    };
}

// never overwrite local state when the server copy is re-saved
const FILE_LOCAL_COLUMNS = ["clientFileId", "localUri", "thumbnailLocalUri", "downloaded", "downloadedAt", "createdAt"];

const SELECT_WITH_FILE = `
  SELECT m.*, c._id AS chatServerId,
    f._id AS f_id, f.clientFileId AS f_clientFileId, f.type AS f_type, f.secureUrl AS f_secureUrl,
    f.thumbnailUrl AS f_thumbnailUrl, f.mimeType AS f_mimeType, f.size AS f_size, f.width AS f_width,
    f.height AS f_height, f.duration AS f_duration, f.localUri AS f_localUri, f.downloaded AS f_downloaded
  FROM messages m
  LEFT JOIN files f ON f.clientFileId = m.fileId
  LEFT JOIN chats c ON c.clientChatId = m.chatId`;

/** row -> the shape the UI/stores already use */
export function rowToMessage(r: any) {
    return {
        _id: (r._id ?? r.clientMessageId) as string,
        clientMessageId: r.clientMessageId as string,
        chatId: (r.chatServerId ?? r.chatId) as string,   // server chat id when known (matches your stores)
        clientChatId: r.chatId as string,
        senderId: r.senderId as string,
        receiverId: r.receiverId ?? undefined,
        type: r.type,
        status: r.status as MessageStatus,
        text: r.text ?? undefined,
        file: r.f_clientFileId
            ? {
                _id: r.f_id ?? r.f_clientFileId, clientFileId: r.f_clientFileId, type: r.f_type,
                secureUrl: r.f_secureUrl, thumbnailUrl: r.f_thumbnailUrl, mimeType: r.f_mimeType, size: r.f_size,
                width: r.f_width, height: r.f_height, duration: r.f_duration,
                localUri: r.f_localUri, downloaded: !!r.f_downloaded,
            }
            : undefined,
        localFileUri: r.localFileUri ?? undefined,
        location: r.latitude != null ? { latitude: r.latitude, longitude: r.longitude, name: r.locationName } : undefined,
        link: r.link ? JSON.parse(r.link) : undefined,
        replyTo: r.replyToId ?? undefined,
        isDeleted: !!r.isDeleted,
        isEdited: !!r.isEdited,
        editedAt: iso(r.editedAt),
        isStarred: !!r.isStarred,
        createdAt: iso(r.createdAt)!,
        updatedAt: iso(r.updatedAt)!,
    };
}
export type AppMessage = ReturnType<typeof rowToMessage>;

// ═════════════════════════════ CREATE ═════════════════════════════

const COLS = Object.keys(messageToRow({ chatId: "x", senderId: "x" }, { clientChatId: "x" }));

const ON_CONFLICT_UPDATE = `
  _id        = COALESCE(excluded._id, messages._id),
  status     = CASE WHEN ${rankSql("excluded.status")} >= ${rankSql("messages.status")} THEN excluded.status ELSE messages.status END,
  text       = excluded.text,
  fileId     = COALESCE(excluded.fileId, messages.fileId),
  isDeleted  = excluded.isDeleted,
  isEdited   = excluded.isEdited,
  editedAt   = excluded.editedAt,
  isStarred  = excluded.isStarred,
  updatedAt  = excluded.updatedAt`;

// Reconcile by the local key (optimistic row) OR by the server id (already stored). Needs SQLite >= 3.35.
const UPSERT_SQL = `
  INSERT INTO messages (${COLS.join(",")}) VALUES (${ph(COLS.length)})
  ON CONFLICT(clientMessageId) DO UPDATE SET ${ON_CONFLICT_UPDATE}
  ON CONFLICT(_id) DO UPDATE SET ${ON_CONFLICT_UPDATE}`;

/** ONE or MANY server messages (socket events, REST pages): resolves chat/file keys, upserts files, then messages. */
export async function saveMessages(messages: any[], db?: Db) {
    if (!messages.length) return;

    const run = async (d: Db) => {
        // 1. files first (messages point at them)
        const files = new Map<string, Row>();
        for (const m of messages) {
            if (m.file && typeof m.file === "object") files.set(String(m.file._id), fileToRow(m.file));
        }
        await upsertMany("files", [...files.values()], { conflict: "_id", exclude: FILE_LOCAL_COLUMNS, db: d });
        const fileKeys = await lookup(d, "files", "_id", "clientFileId", messages.map((m) => idOf(m.file)).filter(Boolean) as string[]);

        // 2. chats (stub rows for conversations we haven't synced yet)
        const chatKeys = await ensureChats(d, messages.map((m) => String(m.chatId)));

        // 3. messages
        const stmt = await d.prepareAsync(UPSERT_SQL);
        try {
            for (const m of messages) {
                const fileServerId = idOf(m.file);
                const row = messageToRow(m, {
                    clientChatId: chatKeys.get(String(m.chatId))!,
                    clientFileId: fileServerId ? fileKeys.get(fileServerId) ?? null : null,
                });
                await stmt.executeAsync(COLS.map((c) => row[c] ?? null));
            }
        } finally {
            await stmt.finalizeAsync();
        }
    };
    await (db ? run(db) : transaction(run));
}
export const saveMessage = (m: any, db?: Db) => saveMessages([m], db);

/** Optimistic send: message row (status "pending") + outbox row, atomically. `chatKey` = clientChatId or server _id. */
export async function createPending(input: {
    clientMessageId: string;
    chatKey: string;
    senderId: string;
    receiverId?: string;
    type?: string;
    text?: string;
    localFileUri?: string;
    payload: unknown;   // what you will POST
    asset?: unknown;    // { uri, fileName, resourceType }
}) {
    const now = Date.now();
    await transaction(async (txn) => {
        const chatId = await resolveClientChatId(input.chatKey, txn);
        if (!chatId) throw new Error(`createPending: unknown chat ${input.chatKey}`);

        await txn.runAsync(
            `INSERT INTO messages (clientMessageId, chatId, senderId, receiverId, type, status, text, localFileUri, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`,
            [input.clientMessageId, chatId, input.senderId, input.receiverId ?? null,
            input.type ?? "text", input.text ?? null, input.localFileUri ?? null, now, now]
        );
        await txn.runAsync(
            `INSERT INTO outbox (clientMessageId, chatId, receiverId, payload, asset, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [input.clientMessageId, chatId, input.receiverId ?? null,
            JSON.stringify(input.payload), input.asset ? JSON.stringify(input.asset) : null, now]
        );
    });
    return getByClientId(input.clientMessageId);
}

// ═════════════════════════════ READ ═════════════════════════════

export async function getByClientId(clientMessageId: string) {
    const db = await getDb();
    const r = await db.getFirstAsync(`${SELECT_WITH_FILE} WHERE m.clientMessageId = ?`, [clientMessageId]);
    return r ? rowToMessage(r) : null;
}

export async function getByServerId(serverId: string) {
    const db = await getDb();
    const r = await db.getFirstAsync(`${SELECT_WITH_FILE} WHERE m._id = ?`, [serverId]);
    return r ? rowToMessage(r) : null;
}

/**
 * MANY: one page of a chat, newest first (matches the inverted FlatList).
 * `chatKey` can be the clientChatId or the server chat _id. Pass `before` = previous nextCursor for older pages.
 */
export async function getChatMessages(chatKey: string, opts: { limit?: number; before?: number } = {}) {
    const limit = opts.limit ?? 30;
    const db = await getDb();
    const rows = await db.getAllAsync(
        `${SELECT_WITH_FILE}
     WHERE m.chatId = (SELECT clientChatId FROM chats WHERE clientChatId = ? OR _id = ? LIMIT 1)
       AND (? IS NULL OR m.createdAt < ?)
     ORDER BY m.createdAt DESC, m.rowid DESC
     LIMIT ?`,
        [chatKey, chatKey, opts.before ?? null, opts.before ?? null, limit]
    );
    const last: any = rows[rows.length - 1];
    return {
        messages: rows.map(rowToMessage),
        nextCursor: rows.length === limit ? (last.createdAt as number) : null,
    };
}

/** Server ids of the other person's messages that we haven't marked read yet */
export async function getUnreadServerIds(chatKey: string, myId: string): Promise<string[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<{ _id: string }>(
        `SELECT _id FROM messages
     WHERE chatId = (SELECT clientChatId FROM chats WHERE clientChatId = ? OR _id = ? LIMIT 1)
       AND senderId != ? AND status != 'read' AND _id IS NOT NULL`,
        [chatKey, chatKey, myId]
    );
    return rows.map((r) => r._id);
}

export async function getPendingOutbox() {
    const db = await getDb();
    return db.getAllAsync(`SELECT * FROM outbox WHERE status IN ('pending','sending') ORDER BY createdAt ASC`);
}

// ═════════════════════════════ UPDATE ═════════════════════════════

/** ONE: the server accepted our pending message. Adds the server ids, keeps the local file, clears the outbox. */
export async function confirmSent(clientMessageId: string, serverMessage: any) {
    await transaction(async (txn) => {
        let clientFileId: string | null = null;

        if (serverMessage.file && typeof serverMessage.file === "object") {
            await upsertMany("files", [fileToRow(serverMessage.file)], { conflict: "_id", exclude: FILE_LOCAL_COLUMNS, db: txn });
            clientFileId = (await lookup(txn, "files", "_id", "clientFileId", [String(serverMessage.file._id)])).get(String(serverMessage.file._id)) ?? null;

            // the file we just uploaded is already on the device: remember it so it is never downloaded again
            const local = await txn.getFirstAsync<{ localFileUri: string | null }>(
                "SELECT localFileUri FROM messages WHERE clientMessageId = ?", [clientMessageId]
            );
            if (clientFileId && local?.localFileUri) {
                await txn.runAsync(
                    "UPDATE files SET localUri = COALESCE(localUri, ?), downloaded = 1, downloadedAt = COALESCE(downloadedAt, ?) WHERE clientFileId = ?",
                    [local.localFileUri, Date.now(), clientFileId]
                );
            }
        }

        await updateOne(
            "messages",
            {
                _id: String(serverMessage._id),
                status: serverMessage.status ?? "sent",
                fileId: clientFileId,
                createdAt: ms(serverMessage.createdAt) ?? Date.now(),
                updatedAt: Date.now(),
            },
            { clientMessageId },
            txn
        );
        await txn.runAsync("DELETE FROM outbox WHERE clientMessageId = ?", [clientMessageId]);
    });
}

/** ONE: sending failed for good */
export async function markFailed(clientMessageId: string, error?: string) {
    await transaction(async (txn) => {
        await updateOne("messages", { status: "failed", updatedAt: Date.now() }, { clientMessageId }, txn);
        await txn.runAsync("UPDATE outbox SET status = 'failed', lastError = ? WHERE clientMessageId = ?", [
            error ?? null, clientMessageId,
        ]);
    });
}

/** MANY: delivered/read receipts by server id. Only moves forward. */
export async function setStatusForServerIds(serverIds: string[], status: "delivered" | "read") {
    if (!serverIds.length) return;
    const rank = STATUS_RANK[status];
    await transaction(async (txn) => {
        for (const part of chunk(serverIds)) {
            await txn.runAsync(
                `UPDATE messages SET status = ?, updatedAt = ?
         WHERE _id IN (${ph(part.length)}) AND ${rankSql("status")} < ?`,
                [status, Date.now(), ...(part as SQLiteBindValue[]), rank]
            );
        }
    });
}

/** ONE */
export const editText = (serverId: string, text: string) =>
    updateOne("messages", { text, isEdited: 1, editedAt: Date.now(), updatedAt: Date.now() }, { _id: serverId });

/** MANY: "delete for everyone" keeps a placeholder row */
export async function softDelete(serverIds: string[]) {
    if (!serverIds.length) return;
    await transaction(async (txn) => {
        for (const part of chunk(serverIds)) {
            await txn.runAsync(
                `UPDATE messages SET isDeleted = 1, text = NULL, fileId = NULL, updatedAt = ? WHERE _id IN (${ph(part.length)})`,
                [Date.now(), ...(part as SQLiteBindValue[])]
            );
        }
    });
}

/** ONE or MANY */
export async function setStarred(clientMessageIds: string[], starred: boolean) {
    if (!clientMessageIds.length) return;
    await transaction(async (txn) => {
        for (const part of chunk(clientMessageIds)) {
            await txn.runAsync(
                `UPDATE messages SET isStarred = ? WHERE clientMessageId IN (${ph(part.length)})`,
                [starred ? 1 : 0, ...part]
            );
        }
    });
}

// ═════════════════════════════ DELETE ═════════════════════════════

/** ONE or MANY: delete for me (orphaned files are removed by a trigger) */
export const deleteMessages = (clientMessageIds: string[]) => deleteByIds("messages", "clientMessageId", clientMessageIds);

/** MANY: wipe a conversation's history, keep the chat row */
export async function clearChat(chatKey: string) {
    const id = await resolveClientChatId(chatKey);
    return id ? deleteWhere("messages", { chatId: id }) : 0;
}