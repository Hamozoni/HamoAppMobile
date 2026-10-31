import { getDb } from "./index";
import { migrations } from "./migrations";

let running: Promise<void> | null = null;

/** Safe to call from several places: concurrent calls share one run. */
export function runMigrations(): Promise<void> {
    running ??= migrate().finally(() => {
        running = null;
    });
    return running;
}

async function migrate() {
    const db = await getDb();

    const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
    const current = row?.user_version ?? 0;
    const latest = migrations[migrations.length - 1]?.version ?? 0;

    if (current > latest) {
        // The DB was created by a newer app version (e.g. a downgrade). Don't touch it.
        console.warn(`DB version ${current} is newer than this app (${latest}). Skipping migrations.`);
        return;
    }
    if (current === latest) return;

    for (const m of migrations.filter((x) => x.version > current)) {
        console.log(`🧱 DB migration ${m.version}: ${m.name}`);

        // One transaction per migration: if any statement fails, the whole migration is rolled back
        // (including the user_version bump), so the next launch retries it cleanly.
        await db.withExclusiveTransactionAsync(async (txn) => {
            if (typeof m.up === "function") {
                await m.up(txn);
            } else {
                for (const sql of m.up) await txn.execAsync(sql);
            }
            await txn.execAsync(`PRAGMA user_version = ${m.version}`);
        });
    }

    console.log(`✅ DB at version ${latest}`);
}
