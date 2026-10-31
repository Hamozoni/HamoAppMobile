import * as SQLite from "expo-sqlite";
import { DB_NAME, closeDb, getDb } from "./index";
import { runMigrations } from "./runMigration";

// Everything tied to the signed-in account (keep sync_state out if it holds device-level data)
const USER_TABLES = [
    "messages",
    "chatParticipants",
    "chats",
    "files",
    "outbox",
    "contacts",
    "syncState",
];

/** Call on logout: another account must never see the previous account's data. */
export async function clearUserData() {
    const db = await getDb();
    await db.withExclusiveTransactionAsync(async (txn) => {
        for (const table of USER_TABLES) await txn.execAsync(`DELETE FROM ${table}`);
    });
}

/** Development helper: delete the whole database file and rebuild it from migrations. */
export async function resetDatabase() {
    await closeDb();
    await SQLite.deleteDatabaseAsync(DB_NAME);
    await runMigrations();
}