
const MIGRATION_002 = `
CREATE TABLE IF NOT EXISTS chats (
    id              TEXT PRIMARY KEY,
    phoneNumber     TEXT NOT NULL,
    displayName     TEXT,
    profilePicture  TEXT,

    -- Last message preview
    lastMessageId       TEXT,
    lastMessageText     TEXT,
    lastMessageType     TEXT DEFAULT 'text',
    lastMessageAt       INTEGER,
    lastMessageSenderId TEXT,

    -- Unread
    unreadCount     INTEGER NOT NULL DEFAULT 0,

    -- Flags
    isPinned        INTEGER NOT NULL DEFAULT 0,
    isArchived      INTEGER NOT NULL DEFAULT 0,
    isMuted         INTEGER NOT NULL DEFAULT 0,
    mutedUntil      INTEGER,

    -- Timestamps
    createdAt       INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updatedAt       INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),

    FOREIGN KEY (phoneNumber) REFERENCES contacts(phoneNumber) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chats_phoneNumber  ON chats (phoneNumber);
CREATE INDEX IF NOT EXISTS idx_chats_lastMessageAt ON chats (lastMessageAt DESC);
CREATE INDEX IF NOT EXISTS idx_chats_isPinned      ON chats (isPinned);
CREATE INDEX IF NOT EXISTS idx_chats_isArchived    ON chats (isArchived);


-- ── Messages ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
    id              TEXT PRIMARY KEY,
    chatId          TEXT NOT NULL,
    senderId        TEXT NOT NULL,
    receiverId      TEXT NOT NULL,

    -- Content
    type            TEXT NOT NULL DEFAULT 'text',
    -- text
    text            TEXT,
    -- image / video / audio / document
    mediaUrl        TEXT,
    mediaMimeType   TEXT,
    mediaSize       INTEGER,
    mediaWidth      INTEGER,
    mediaHeight     INTEGER,
    mediaDuration   INTEGER,   -- audio/video duration in seconds
    -- location
    latitude        REAL,
    longitude       REAL,
    locationName    TEXT,
    -- contact
    contactName     TEXT,
    contactPhone    TEXT,
    contactAvatar   TEXT,
    -- link preview
    linkUrl         TEXT,
    linkTitle       TEXT,
    linkDescription TEXT,
    linkThumbnail   TEXT,

    -- Status
    status          TEXT NOT NULL DEFAULT 'pending',
    -- pending | sent | delivered | read | failed

    -- Reply
    replyToId       TEXT,
    replyToText     TEXT,
    replyToType     TEXT,

    -- Flags
    isDeleted       INTEGER NOT NULL DEFAULT 0,
    isEdited        INTEGER NOT NULL DEFAULT 0,
    isStarred       INTEGER NOT NULL DEFAULT 0,

    -- Timestamps
    createdAt       INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updatedAt       INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),

    FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_chatId    ON messages (chatId);
CREATE INDEX IF NOT EXISTS idx_messages_createdAt ON messages (chatId, createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_messages_status    ON messages (status);
CREATE INDEX IF NOT EXISTS idx_messages_isStarred ON messages (isStarred);
CREATE INDEX IF NOT EXISTS idx_messages_senderId  ON messages (senderId);
`;

export default {
    name: "002_chats",
    sql: MIGRATION_002,
};