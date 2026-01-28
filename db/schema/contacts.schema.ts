

const CONTACTS_SCHEMA = `
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT,
    phoneNumber TEXT,
    profilePicture TEXT,
    about TEXT,
    isPhoneVerified BOOLEAN,
    createdAt DATETIME,
    updatedAt DATETIME
)`

export default CONTACTS_SCHEMA;

