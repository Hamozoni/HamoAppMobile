import { db, expoDb } from "./index";
import * as s from "./schema";
import { runMigrations } from "./runMigration";

/** Call on logout: another account must never see the previous account's data. */
export function clearUserData() {
    db.transaction((tx) => {
        tx.delete(s.messages).run();
        tx.delete(s.chatParticipants).run();
        tx.delete(s.chats).run();
        tx.delete(s.files).run();
        tx.delete(s.outbox).run();
        tx.delete(s.contacts).run();
        tx.delete(s.syncState).run();
    });
}

/** Development helper: drop everything (including Drizzle's migration journal) and migrate again. */
export async function resetDatabase() {
    const tables = ["messages", "chatParticipants", "chats", "files", "outbox", "contacts", "sync_state", "__drizzle_migrations"];
    expoDb.execSync("PRAGMA foreign_keys = OFF");
    for (const t of tables) expoDb.execSync(`DROP TABLE IF EXISTS "${t}"`); // triggers are dropped with their tables
    expoDb.execSync("PRAGMA foreign_keys = ON");
    await runMigrations();
}