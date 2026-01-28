

const FILE_SCHEMA = `
CREATE TABLE IF NOT EXISTS files (
    _id TEXT PRIMARY KEY,       
    secureUrl TEXT,
    publicId TEXT,
    type TEXT,
    ownerId TEXT,
    purpose TEXT,
    localPath TEXT,
    usedBy TEXT,
    localThumbnailUrl TEXT,
    thumbnailUrl TEXT,
    metadata TEXT,
    isDeleted BOOLEAN,
    expiresAt DATETIME,
    createdAt DATETIME,
    updatedAt DATETIME
)`

export default FILE_SCHEMA;