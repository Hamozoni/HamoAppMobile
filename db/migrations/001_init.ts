import * as SQLite from 'expo-sqlite';
import { Migration } from './_meta';

export const migration001_init: Migration = {
    name: '001_init',
    up: (db: SQLite.SQLiteDatabase) => {
        // Create user table for current user info
        db.execSync(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        user_id TEXT UNIQUE NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        avatar_url TEXT,
        about TEXT,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      );
    `);

        // Create settings table
        db.execSync(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      );
    `);

        // Insert default settings
        const defaultSettings = [
            ['theme', 'light'],
            ['notifications_enabled', 'true'],
            ['sound_enabled', 'true'],
            ['vibration_enabled', 'true'],
            ['show_previews', 'true'],
            ['auto_download_photos', 'true'],
            ['auto_download_videos', 'false'],
            ['backup_enabled', 'false'],
        ];

        const stmt = db.prepareSync(
            'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)'
        );

        try {
            for (const [key, value] of defaultSettings) {
                stmt.executeSync([key, value]);
            }
        } finally {
            stmt.finalizeSync();
        }
    },
};