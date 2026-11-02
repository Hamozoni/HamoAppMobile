import { sqliteTable, text, integer, real, index, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Helper for default timestamp (epoch ms)
const now = sql`(strftime('%s','now') * 1000)`;

export const contacts = sqliteTable('contacts', {
    _id: text('_id').notNull(),
    phoneNumber: text('phoneNumber').primaryKey().unique().notNull(),
    countryCode: text('countryCode'),
    countryISO: text('countryISO'),
    displayName: text('displayName'),
    about: text('about'),
    profilePicture: text('profilePicture'),
    isRegistered: integer('isRegistered').notNull().default(0),
    isInMycontacts: integer('isInMycontacts').notNull().default(0),
}, (table) => ({
    idIdx: index('idx_contacts_phoneNumber').on(table.phoneNumber),
    isRegIdx: index('idx_contacts_isRegistered').on(table.isRegistered),
    inContIdx: index('idx_contacts_isInMycontacts').on(table.isInMycontacts),
}));

export const chats = sqliteTable('chats', {
    clientChatId: text('clientChatId').primaryKey().notNull(),
    _id: text('_id').unique(),
    isGroup: integer('isGroup').notNull().default(0),
    peerId: text('peerId'),
    groupName: text('groupName'),
    groupAvatar: text('groupAvatar'),
    lastMessageId: text('lastMessageId'),
    lastMessageText: text('lastMessageText'),
    lastMessageType: text('lastMessageType').notNull().default('text'),
    lastMessageAt: integer('lastMessageAt'),
    lastMessageSenderId: text('lastMessageSenderId'),
    lastMessageStatus: text('lastMessageStatus').notNull().default('sent'),
    unreadCount: integer('unreadCount').notNull().default(0),
    isPinned: integer('isPinned').notNull().default(0),
    isArchived: integer('isArchived').notNull().default(0),
    isMuted: integer('isMuted').notNull().default(0),
    mutedUntil: integer('mutedUntil'),
    createdAt: integer('createdAt').notNull().default(now),
    updatedAt: integer('updatedAt').notNull().default(now),
}, (table) => ({
    lastMsgIdx: index('idx_chatsLastMessage').on(table.lastMessageAt),
    peerIdx: index('idx_chatsPeer').on(table.peerId).where(sql`isGroup = 0`),
}));

export const chatParticipants = sqliteTable('chatParticipants', {
    chatId: text('chatId').notNull().references(() => chats.clientChatId, { onDelete: 'cascade' }),
    userId: text('userId').notNull().references(() => contacts.phoneNumber, { onDelete: 'cascade' }),
    isAdmin: integer('isAdmin').notNull().default(0),
}, (table) => ({
    pk: primaryKey({ columns: [table.chatId, table.userId] }),
    userIdx: index('idx_participantsUser').on(table.userId),
}));

export const files = sqliteTable('files', {
    clientFileId: text('clientFileId').primaryKey().notNull(),
    _id: text('_id').unique(),
    onwerId: text('onwerId').notNull(),
    type: text('type').notNull(),
    purpose: text('purpose'),
    resourceType: text('resourceType'),
    secureUrl: text('secureUrl'),
    thumbnailUrl: text('thumbnailUrl'),
    size: integer('size'),
    mimeType: text('mimeType'),
    format: text('format'),
    width: integer('width'),
    height: integer('height'),
    duration: real('duration'),
    pages: integer('pages'),
    metadata: text('metadata'),
    localUri: text('localUri'),
    thumbnailLocalUri: text('thumbnailLocalUri'),
    downloaded: integer('downloaded').notNull().default(0),
    downloadedAt: integer('downloadedAt'),
    expiresAt: integer('expiresAt'),
    createdAt: integer('createdAt').notNull().default(now),
}, (table) => ({
    idIdx: index('idx_files_id').on(table._id),
}));

export const messages = sqliteTable('messages', {
    clientMessageId: text('clientMessageId').primaryKey().notNull(),
    _id: text('_id').unique(),
    chatId: text('chatId').notNull().references(() => chats.clientChatId, { onDelete: 'cascade' }),
    senderId: text('senderId').notNull(),
    receiverId: text('receiverId'),
    type: text('type').notNull().default('text'),
    status: text('status').notNull().default('sent'),
    text: text('text'),
    fileId: text('fileId').references(() => files.clientFileId),
    localFileUri: text('localFileUri'),
    latitude: real('latitude'),
    longitude: real('longitude'),
    locationName: text('locationName'),
    link: text('link'),
    replyToId: text('replyToId'),
    isDeleted: integer('isDeleted').notNull().default(0),
    isEdited: integer('isEdited').notNull().default(0),
    editedAt: integer('editedAt'),
    isStarred: integer('isStarred').notNull().default(0),
    createdAt: integer('createdAt').notNull(),
    updatedAt: integer('updatedAt').notNull(),
}, (table) => ({
    idIdx: index('idx_messages_id').on(table._id),
    chatIdIdx: index('idx_messages_chat').on(table.chatId),
    createdAtIdx: index('idx_messages_createdAt').on(table.createdAt),
    statusIdx: index('idx_messages_status').on(table.status),
}));

export const outbox = sqliteTable('outbox', {
    clientMessageId: text('clientMessageId').primaryKey().notNull(),
    chatId: text('chatId').notNull().references(() => chats.clientChatId, { onDelete: 'cascade' }),
    receiverId: text('receiverId'),
    payload: text('payload').notNull(),
    asset: text('asset'),
    status: text('status').notNull().default('pending'),
    attempts: integer('attempts').notNull().default(0),
    lastError: text('lastError'),
    nextAttemptAt: integer('nextAttemptAt'),
    createdAt: integer('createdAt').notNull().default(now),
});

export const syncState = sqliteTable('sync_state', {
    key: text('key').primaryKey().notNull(),
    value: text('value'),
});