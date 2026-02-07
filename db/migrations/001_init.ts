const MIGRATION_001 = `
CREATE TABLE IF NOT EXISTS contacts (
  _id TEXT,
  phoneNumber TEXT PRIMARY KEY,
  countryCode TEXT,
  countryISO TEXT,
  displayName TEXT,
  about TEXT,
  profilePicture TEXT,
  isRegistered INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_contacts_phoneNumber
ON contacts (phoneNumber);
`;

export default {
  name: "001_init",
  sql: MIGRATION_001,
};
