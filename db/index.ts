import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrations/_meta';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Get or initialize the database connection
 */
export const getDatabase = (): SQLite.SQLiteDatabase => {
    if (!db) {
        const dbName = __DEV__ ? 'sudachat_dev.db' : 'sudachat.db';

        db = SQLite.openDatabaseSync(dbName);

        // Enable foreign keys and WAL mode for performance
        db.execSync('PRAGMA foreign_keys = ON;');
        db.execSync('PRAGMA journal_mode = WAL;');
        db.execSync('PRAGMA synchronous = NORMAL;');
        db.execSync('PRAGMA temp_store = MEMORY;');

        console.log(`📁 Database opened: ${dbName}`);
    }
    return db;
};

/**
 * Initialize database and run migrations
 */
export const initDatabase = (): void => {
    const database = getDatabase();

    // Create migrations table if not exists
    database.execSync(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      executed_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
    );
  `);

    // Run all migrations
    runMigrations(database);

    console.log('✅ Database initialized');
};

/**
 * Execute a transaction synchronously
 */
export const executeTransaction = <T>(
    operations: (db: SQLite.SQLiteDatabase) => T
): T => {
    const database = getDatabase();

    try {
        database.execSync('BEGIN TRANSACTION;');
        const result = operations(database);
        database.execSync('COMMIT;');
        return result;
    } catch (error) {
        database.execSync('ROLLBACK;');
        console.error('Transaction error:', error);
        throw error;
    }
};

/**
 * Execute a SELECT query
 */
export const executeQuery = <T = any>(
    sql: string,
    params?: any[]
): T[] => {
    const database = getDatabase();
    return database.getAllSync<T>(sql, params);
};

/**
 * Get a single row from a SELECT query
 */
export const executeQueryFirst = <T = any>(
    sql: string,
    params?: any[]
): T | null => {
    const database = getDatabase();
    return database.getFirstSync<T>(sql, params);
};

/**
 * Execute an INSERT/UPDATE/DELETE query
 */
export const executeUpdate = (
    sql: string,
    params?: any[]
): SQLite.SQLiteRunResult => {
    const database = getDatabase();
    return database.runSync(sql, params);
};

/**
 * Execute a batch of operations with prepared statement
 */
export const executeBatch = <T extends any[]>(
    sql: string,
    paramsList: T[]
): void => {
    const database = getDatabase();
    const statement = database.prepareSync(sql);

    try {
        executeTransaction(() => {
            for (const params of paramsList) {
                statement.executeSync(params);
            }
        });
    } finally {
        statement.finalizeSync();
    }
};

/**
 * Close database connection
 */
export const closeDatabase = (): void => {
    if (db) {
        db.closeSync();
        db = null;
        console.log('📁 Database closed');
    }
};

// Export database instance
export const database = getDatabase();