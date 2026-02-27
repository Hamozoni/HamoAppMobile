import { executeQuery, executeQueryFirst, executeUpdate, executeBatch } from "../index";
import { Chat, Message, MessageType, MessageStatus } from "../types/chat.type";


export function upsertChat(chat: Partial<Chat> & { id: string; phoneNumber: string }): void {

    executeUpdate(`
        INSERT INTO chats (
            id, phoneNumber, displayName, profilePicture,
            lastMessageId, lastMessageText, lastMessageType,
            lastMessageAt, lastMessageSenderId,
            unreadCount, isPinned, isArchived, isMuted, mutedUntil,
            createdAt, updatedAt
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON CONFLICT(id) DO UPDATE SET
            displayName         = excluded.displayName,
            profilePicture      = excluded.profilePicture,
            lastMessageId       = excluded.lastMessageId,
            lastMessageText     = excluded.lastMessageText,
            lastMessageType     = excluded.lastMessageType,
            lastMessageAt       = excluded.lastMessageAt,
            lastMessageSenderId = excluded.lastMessageSenderId,
            unreadCount         = excluded.unreadCount,
            isPinned            = excluded.isPinned,
            isArchived          = excluded.isArchived,
            isMuted             = excluded.isMuted,
            mutedUntil          = excluded.mutedUntil,
            updatedAt           = excluded.updatedAt
    `, [
        chat.id, chat.phoneNumber, chat.displayName ?? null,
        chat.profilePicture ?? null, chat.lastMessageId ?? null,
        chat.lastMessageText ?? null, chat.lastMessageType ?? "text",
        chat.lastMessageAt ?? null, chat.lastMessageSenderId ?? null,
        chat.unreadCount ?? 0, chat.isPinned ?? 0,
        chat.isArchived ?? 0, chat.isMuted ?? 0,
        chat.mutedUntil ?? null, chat.createdAt ?? Date.now(),
        Date.now(),
    ]);
}

export function getChats(): Chat[] {
    return executeQuery<Chat>(`
        SELECT * FROM chats
        WHERE isArchived = 0
        ORDER BY isPinned DESC, lastMessageAt DESC
    `);
}

export function getArchivedChats(): Chat[] {
    return executeQuery<Chat>(
        "SELECT * FROM chats WHERE isArchived = 1 ORDER BY lastMessageAt DESC"
    );
}

export function getChatByPhone(phoneNumber: string): Chat | null {
    return executeQueryFirst<Chat>(
        "SELECT * FROM chats WHERE phoneNumber = ?", [phoneNumber]
    );
}

export function updateChatLastMessage(
    chatId: string,
    message: Pick<Message, "id" | "text" | "type" | "createdAt" | "senderId">
): void {
    executeUpdate(`
        UPDATE chats SET
            lastMessageId       = ?,
            lastMessageText     = ?,
            lastMessageType     = ?,
            lastMessageAt       = ?,
            lastMessageSenderId = ?,
            updatedAt           = ?
        WHERE id = ?
    `, [
        message.id, message.text ?? null,
        message.type, message.createdAt,
        message.senderId, Date.now(), chatId,
    ]);
}

export function incrementUnread(chatId: string): void {
    executeUpdate(
        "UPDATE chats SET unreadCount = unreadCount + 1 WHERE id = ?",
        [chatId]
    );
}

export function markChatAsRead(chatId: string): void {
    executeUpdate(
        "UPDATE chats SET unreadCount = 0 WHERE id = ?",
        [chatId]
    );
}

export function pinChat(chatId: string, pin: boolean): void {
    executeUpdate("UPDATE chats SET isPinned = ? WHERE id = ?", [pin ? 1 : 0, chatId]);
}

export function archiveChat(chatId: string, archive: boolean): void {
    executeUpdate("UPDATE chats SET isArchived = ? WHERE id = ?", [archive ? 1 : 0, chatId]);
}

export function muteChat(chatId: string, until?: number): void {
    executeUpdate(
        "UPDATE chats SET isMuted = 1, mutedUntil = ? WHERE id = ?",
        [until ?? null, chatId]
    );
}

export function unmuteChat(chatId: string): void {
    executeUpdate(
        "UPDATE chats SET isMuted = 0, mutedUntil = NULL WHERE id = ?",
        [chatId]
    );
}

export function deleteChat(chatId: string): void {
    executeUpdate("DELETE FROM chats WHERE id = ?", [chatId]);
}

// ── Messages ──────────────────────────────────────────────────

export function insertMessage(msg: Message): void {
    executeUpdate(`
        INSERT OR IGNORE INTO messages (
            id, chatId, senderId, receiverId, type,
            text, mediaUrl, mediaMimeType, mediaSize,
            mediaWidth, mediaHeight, mediaDuration,
            latitude, longitude, locationName,
            contactName, contactPhone, contactAvatar,
            linkUrl, linkTitle, linkDescription, linkThumbnail,
            replyToId, replyToText, replyToType,
            status, isDeleted, isEdited, isStarred,
            createdAt, updatedAt
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `, [
        msg.id, msg.chatId, msg.senderId, msg.receiverId, msg.type,
        msg.text ?? null, msg.mediaUrl ?? null, msg.mediaMimeType ?? null,
        msg.mediaSize ?? null, msg.mediaWidth ?? null, msg.mediaHeight ?? null,
        msg.mediaDuration ?? null, msg.latitude ?? null, msg.longitude ?? null,
        msg.locationName ?? null, msg.contactName ?? null, msg.contactPhone ?? null,
        msg.contactAvatar ?? null, msg.linkUrl ?? null, msg.linkTitle ?? null,
        msg.linkDescription ?? null, msg.linkThumbnail ?? null,
        msg.replyToId ?? null, msg.replyToText ?? null, msg.replyToType ?? null,
        msg.status ?? "pending", msg.isDeleted ?? 0, msg.isEdited ?? 0,
        msg.isStarred ?? 0, msg.createdAt ?? Date.now(), Date.now(),
    ]);
}

export function getMessages(chatId: string, limit = 50, before?: number): Message[] {
    if (before) {
        return executeQuery<Message>(`
            SELECT * FROM messages
            WHERE chatId = ? AND createdAt < ? AND isDeleted = 0
            ORDER BY createdAt DESC LIMIT ?
        `, [chatId, before, limit]);
    }
    return executeQuery<Message>(`
        SELECT * FROM messages
        WHERE chatId = ? AND isDeleted = 0
        ORDER BY createdAt DESC LIMIT ?
    `, [chatId, limit]);
}

export function updateMessageStatus(
    messageId: string,
    status: MessageStatus
): void {
    executeUpdate(
        "UPDATE messages SET status = ?, updatedAt = ? WHERE id = ?",
        [status, Date.now(), messageId]
    );
}

export function markAllMessagesRead(chatId: string, myId: string): void {
    executeUpdate(`
        UPDATE messages SET status = 'read', updatedAt = ?
        WHERE chatId = ? AND senderId != ? AND status != 'read'
    `, [Date.now(), chatId, myId]);
}

export function deleteMessage(messageId: string, hardDelete = false): void {
    if (hardDelete) {
        executeUpdate("DELETE FROM messages WHERE id = ?", [messageId]);
    } else {
        executeUpdate(
            "UPDATE messages SET isDeleted = 1, text = NULL, mediaUrl = NULL, updatedAt = ? WHERE id = ?",
            [Date.now(), messageId]
        );
    }
}

export function starMessage(messageId: string, star: boolean): void {
    executeUpdate(
        "UPDATE messages SET isStarred = ?, updatedAt = ? WHERE id = ?",
        [star ? 1 : 0, Date.now(), messageId]
    );
}

export function getStarredMessages(chatId: string): Message[] {
    return executeQuery<Message>(
        "SELECT * FROM messages WHERE chatId = ? AND isStarred = 1 AND isDeleted = 0 ORDER BY createdAt DESC",
        [chatId]
    );
}