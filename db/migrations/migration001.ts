import type { SQLiteDatabase } from "expo-sqlite";

export interface Migration {
  /** Sequential integer: 1, 2, 3 ... Stored in PRAGMA user_version. */
  version: number;
  name: string;
  /**
   * Either a list of SQL statements, or a function for data migrations
   * (e.g. read rows, transform, write back). Runs inside one transaction.
   */
  up: string[] | ((txn: SQLiteDatabase) => Promise<void>);
}
export const migration001: Migration = {
  version: 1,
  name: "initial_schema",
  up: [

    // ───────────────── contacts (device contacts + registered match) ─────────────────
    // ADAPT to what syncContacts() writes today.
    `CREATE TABLE IF NOT EXISTS contacts (
          _id TEXT PRIMARY KEY,
          phoneNumber TEXT,
          countryCode TEXT,
          countryISO TEXT,
          displayName TEXT NOT NULL,
          about TEXT,
          profilePicture TEXT,
          isRegistered INTEGER NOT NULL DEFAULT 0,
          isInMycontacts INTEGER NOT NULL DEFAULT 0
      )`,
    `CREATE INDEX IF NOT EXISTS idx_contacts_phoneNumber ON contacts (phoneNumber)`,
    `CREATE INDEX IF NOT EXISTS idx_contacts_isRegistered ON contacts (isRegistered)`,

    // ───────────────── chats ─────────────────
    `CREATE TABLE IF NOT EXISTS chats (
       _id                   TEXT,
      clientChatId           TEXT PRIMARY KEY NOT NULL,
      isGroup               INTEGER NOT NULL DEFAULT 0,

      groupName             TEXT,
      groupAvatar           TEXT,

      lastMessageId        TEXT,
      lastMessageText      TEXT,
      lastMessageType      TEXT NOT NULL DEFAULT 'text',
      lastMessageAt        INTEGER,
      lastMessageSenderId TEXT,
      lastMessageStatus    TEXT NOT NULL DEFAULT 'sent',

      unreadCount           INTEGER NOT NULL DEFAULT 0,
      isPinned              INTEGER NOT NULL DEFAULT 0,
      isArchived            INTEGER NOT NULL DEFAULT 0,
      isMuted               INTEGER NOT NULL DEFAULT 0,
      mutedUntil            INTEGER,

      createdAt             INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
      updatedAt             INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_chatsLastMessage ON chats(lastMessageAt DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_chatsPeer ON chats(peerId) WHERE isGroup = 0`,

    `CREATE TABLE IF NOT EXISTS chatParticipants (
      chatId   TEXT NOT NULL,
      userId   TEXT NOT NULL,
      isAdmin  INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (chatId, userId),
      FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE
    )`,
    `CREATE INDEX IF NOT EXISTS idx_participantsUser ON chatParticipants(userId)`,

    // ───────────────── files (attachment metadata + local download state) ─────────────────
    `CREATE TABLE IF NOT EXISTS files (
      _id                   TEXT,
      clientFileId          TEXT PRIMARY KEY NOT NULL,
      type                 TEXT NOT NULL,              -- image | video | audio | document
      purpose              TEXT,
      resourceType        TEXT,
      secureUrl           TEXT,
      thumbnailUrl        TEXT,

      size                 INTEGER,
      mimeType            TEXT,
      format               TEXT,
      width                INTEGER,
      height               INTEGER,
      duration             REAL,
      pages                INTEGER,
      metadata             TEXT,                       -- full server metadata as JSON

      localUri            TEXT,                       -- path after download
      thumbnailLocalUri  TEXT,
      downloaded           INTEGER NOT NULL DEFAULT 0,
      downloadedAt        INTEGER,
      expiresAt           INTEGER,
      createdAt           INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
    )`,

    // ───────────────── messages ─────────────────
    `CREATE TABLE IF NOT EXISTS messages (
      clientMessageId        TEXT PRIMARY KEY NOT NULL,
      _id              T     TEXT UNIQUE,
      chatId                TEXT NOT NULL,
      senderId              TEXT NOT NULL,
      receiverId            TEXT,                     -- NULL for group messages

      type                   TEXT NOT NULL DEFAULT 'text',
      status                 TEXT NOT NULL DEFAULT 'sent',   -- pending|sent|delivered|read|failed

      text                   TEXT,

      fileId                TEXT,
      localFileUri         TEXT,                     -- picked file before it is uploaded

      latitude               REAL,
      longitude              REAL,
      locationName          TEXT,

      link               TEXT,                     -- { url, title, description, thumbnail, siteName }

      replyToId            TEXT,                     -- server_id of the replied message

      isDeleted             INTEGER NOT NULL DEFAULT 0,
      isEdited              INTEGER NOT NULL DEFAULT 0,
      editedAt              INTEGER,
      isStarred             INTEGER NOT NULL DEFAULT 0,   -- starred by the signed-in user

      deliveredAt           INTEGER,
      readAt                INTEGER,

      createdAt             INTEGER NOT NULL,
      updatedAt             INTEGER NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_messages_chat_created ON messages(chatId, createdAt DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_messages_chat_status  ON messages(chatId, status)`,
    `CREATE INDEX IF NOT EXISTS idx_messages_starred      ON messages(createdAt DESC) WHERE isStarred = 1`,
    `CREATE INDEX IF NOT EXISTS idx_messages_file         ON messages(fileId) WHERE fileId IS NOT NULL`,

    // deleting a chat removes its messages (no FK, see design notes)
    `CREATE TRIGGER IF NOT EXISTS trg_chats_delete_messages
     AFTER DELETE ON chats
     BEGIN
       DELETE FROM messages WHERE chatId = OLD.id;
     END`,

    // ───────────────── outbox (offline send queue) ─────────────────
    `CREATE TABLE IF NOT EXISTS outbox (
      clientMessageId TEXT PRIMARY KEY NOT NULL,
      chatId           TEXT NOT NULL,
      receiverId       TEXT,
      payload           TEXT NOT NULL,                 -- JSON: text, type, ...
      asset             TEXT,                          -- JSON: uri, fileName, resourceType
      status            TEXT NOT NULL DEFAULT 'pending',   -- pending | sending | failed
      attempts          INTEGER NOT NULL DEFAULT 0,
      lastError        TEXT,
      nextAttemptAt   INTEGER,
      createdAt        INTEGER NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_outbox_status ON outbox(status, createdAt)`,

    // ───────────────── sync_state (key/value: last sync time, cursors, ...) ─────────────────
    `CREATE TABLE IF NOT EXISTS sync_state (
      key   TEXT PRIMARY KEY NOT NULL,
      value TEXT
    )`,
  ],
};