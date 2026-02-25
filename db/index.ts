import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = (): SQLite.SQLiteDatabase => {
    if (!db) {
        const dbName = __DEV__ ? "sudachat_dev.db" : "sudachat.db";
        db = SQLite.openDatabaseSync(dbName);

        db.execSync("PRAGMA foreign_keys = ON;");
        db.execSync("PRAGMA journal_mode = WAL;");
        db.execSync("PRAGMA synchronous = NORMAL;");
        db.execSync("PRAGMA temp_store = MEMORY;");

        console.log(`📁 SQLite opened: ${dbName}`);
    }
    return db;
};

export const executeTransaction = <T>(
    fn: (db: SQLite.SQLiteDatabase) => T
): T => {
    const database = getDatabase();
    try {
        database.execSync("BEGIN;");
        const result = fn(database);
        database.execSync("COMMIT;");
        return result;
    } catch (e) {
        database.execSync("ROLLBACK;");
        throw e;
    }
};

export const executeQuery = <T = any>(
    sql: string,
    params?: any[]
): T[] => {
    return getDatabase().getAllSync<T>(sql, params ?? []);
};

export const executeQueryFirst = <T = any>(
    sql: string,
    params?: any[]
): T | null => {
    return getDatabase().getFirstSync<T>(sql, params ?? []);
};

export const executeUpdate = (
    sql: string,
    params?: any[]
) => {
    return getDatabase().runSync(sql, params ?? []);
};

export const executeBatch = (sql: string, paramsList: readonly any[][]) => {

    const db = getDatabase();
    const stmt = db.prepareSync(sql);

    try {
        executeTransaction(() => {
            for (const params of paramsList) {
                stmt.executeSync(params);
            }
        });
    } finally {
        stmt.finalizeSync();
    }
};
