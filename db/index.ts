import * as SQLite from "expo-sqlite";

export const DB_NAME = __DEV__ ? "sudachat_dev.db" : "sudachat.db";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Single shared connection. If you already have a db module, keep yours and import getDb from it. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
    dbPromise ??= (async () => {
        const db = await SQLite.openDatabaseAsync(DB_NAME);
        // WAL: faster writes and readers don't block the writer. foreign_keys must be set outside a transaction.
        await db.execAsync("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
        console.log("📁 SQLite opened:", DB_NAME);
        return db;
    })();
    return dbPromise;
}

export async function closeDb() {
    if (!dbPromise) return;
    const db = await dbPromise;
    dbPromise = null;
    await db.closeAsync();
};
