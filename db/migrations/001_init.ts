const MIGRATION_001 = `
CREATE TABLE IF NOT EXISTS contacts (
  _id TEXT PRIMARY KEY,
  phoneNumber TEXT NOT NULL,
  phoneE164 TEXT NOT NULL UNIQUE,
  countryCode TEXT,
  countryISO TEXT,
  displayName TEXT,
  about TEXT,
  profilePicture TEXT,
  lastSeen INTEGER,
  isOnline INTEGER DEFAULT 0,
  isBlocked INTEGER DEFAULT 0,
  isRegistered INTEGER DEFAULT 0,
  userId TEXT
);

CREATE INDEX IF NOT EXISTS idx_contacts_phoneE164
ON contacts (phoneE164);
`;

export default {
  name: "001_init",
  sql: MIGRATION_001,
};
