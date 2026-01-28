import * as SQLite from 'expo-sqlite';
import { migration001_init } from './001_init';
// import { migration002_contacts } from './002_contacts';
// import { migration003_chats } from './003_chats';
// import { migration004_messages } from './004_messages';
// import { migration005_blocked } from './005_blocked';

export interface Migration {
    name: string;
    up: (db: SQLite.SQLiteDatabase) => void;
}

const migrations: Migration[] = [
    migration001_init,
    //   migration002_contacts,
    //   migration003_chats,
    //   migration004_messages,
    //   migration005_blocked,
];

/**
 * Check if migration has been executed
 */
const isMigrationExecuted = (db: SQLite.SQLiteDatabase, name: string): boolean => {
    const result = db.getFirstSync<{ count: number }>(
        'SELECT COUNT(*) as count FROM _migrations WHERE name = ?',
        [name]
    );
    return (result?.count ?? 0) > 0;
};

/**
 * Mark migration as executed
 */
const markMigrationExecuted = (db: SQLite.SQLiteDatabase, name: string): void => {
    db.runSync(
        'INSERT INTO _migrations (name, executed_at) VALUES (?, ?)',
        [name, Date.now()]
    );
};

/**
 * Run all pending migrations
 */
export const runMigrations = (db: SQLite.SQLiteDatabase): void => {
    console.log('🔄 Running database migrations...');

    for (const migration of migrations) {
        if (!isMigrationExecuted(db, migration.name)) {
            console.log(`  ⏳ Executing migration: ${migration.name}`);

            try {
                db.execSync('BEGIN TRANSACTION;');
                migration.up(db);
                markMigrationExecuted(db, migration.name);
                db.execSync('COMMIT;');

                console.log(`  ✅ Migration completed: ${migration.name}`);
            } catch (error) {
                db.execSync('ROLLBACK;');
                console.error(`  ❌ Migration failed: ${migration.name}`, error);
                throw error;
            }
        } else {
            console.log(`  ⏭️  Skipping migration: ${migration.name} (already executed)`);
        }
    }

    console.log('✅ All migrations completed');
};