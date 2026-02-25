import { getDatabase } from "./index";
import migration001 from "./migrations/001_init";

const migrations = [migration001];

export function runMigrations() {
    const db = getDatabase();

    db.execSync(`
        CREATE TABLE IF NOT EXISTS _migrations (
            name TEXT PRIMARY KEY,
            executedAt INTEGER
        );
    `);

    for (const m of migrations) {
        const executed = db.getFirstSync(
            "SELECT 1 FROM _migrations WHERE name = ?",
            [m.name]
        );

        if (!executed) {
            console.log(`🚀 Running migration ${m.name}`);

            try {
                db.execSync("BEGIN;");
                db.execSync(m.sql);
                db.runSync(
                    "INSERT INTO _migrations (name, executedAt) VALUES (?, ?)",
                    [m.name, Date.now()]
                );
                db.execSync("COMMIT;");
            } catch (e) {
                db.execSync("ROLLBACK;");
                console.error("❌ Migration failed:", m.name, e);
                throw e;
            }
        }
    }
}
