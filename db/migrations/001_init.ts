const MIGRATION_001 = `
CREATE TABLE IF NOT EXISTS contacts (
    _id          TEXT,
    phoneNumber  TEXT PRIMARY KEY,
    countryCode  TEXT,
    countryISO   TEXT,
    displayName  TEXT NOT NULL,
    about        TEXT,
    profilePicture TEXT,
    isRegistered INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (phoneNumber) REFERENCES users(phoneNumber) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_contacts_isRegistered 
ON contacts (isRegistered);

CREATE INDEX IF NOT EXISTS idx_contacts_displayName
ON contacts (displayName);
`;

export default {
  name: "001_init",
  sql: MIGRATION_001,
};