import * as SQLite from 'expo-sqlite';

export const migration_002_contacts = {
  version: 2,
  name: 'contacts_table',
  up: (db: SQLite.SQLiteDatabase) => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS contacts (
        _id TEXT PRIMARY KEY,
        phoneNumber TEXT,
        countryCode TEXT,
        countryISO TEXT,
        displayName TEXT,
        profilePicture TEXT,
        isRegistered BOOLEAN
        FOREIGN KEY (_id) REFERENCES users(_id) ON DELETE CASCADE
      );
    `);

    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_contacts_phoneNumber ON contacts(phoneNumber);
    `);

    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_contacts_id ON contacts(_id);
    `);
  }
};