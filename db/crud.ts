import type { SQLiteBindValue, SQLiteDatabase } from "expo-sqlite";
import { getDb } from "./index";


export type Db = SQLiteDatabase;
export type Row = Record<string, SQLiteBindValue>;
/** { col: value } -> col = ?   |   { col: [a,b] } -> col IN (?,?)   |   { col: null } -> col IS NULL */
export type Where = Record<string, SQLiteBindValue | SQLiteBindValue[]>;
/** Escape hatch for ranges etc: { sql: "created_at < ?", params: [123] } (never interpolate user values into sql) */
export interface Extra { sql: string; params?: SQLiteBindValue[] }

// ───────────── safety: identifiers cannot be bound as parameters, so validate them ─────────────
const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;
const ORDER = /^[A-Za-z_][A-Za-z0-9_.]*( (ASC|DESC))?(, ?[A-Za-z_][A-Za-z0-9_.]*( (ASC|DESC))?)*$/i;

const ident = (name: string) => {
    if (!IDENT.test(name)) throw new Error(`Unsafe SQL identifier: ${name}`);
    return name;
};

export function chunk<T>(items: T[], size = 500): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
    return out;
}

/**
 * Runs `fn` inside one transaction. Inside `fn` ALWAYS use the `txn` argument, never getDb()
 * (an exclusive transaction blocks other connections' queries and would deadlock).
 */
export async function transaction<T>(fn: (txn: Db) => Promise<T>): Promise<T> {
    const db = await getDb();
    let result!: T;
    await db.withExclusiveTransactionAsync(async (txn) => {
        result = await fn(txn as unknown as Db);
    });
    return result;
}

/** If the caller already passed a db/txn, join it. Otherwise open our own transaction. */
async function inTx<T>(db: Db | undefined, fn: (d: Db) => Promise<T>): Promise<T> {
    return db ? fn(db) : transaction(fn);
}

function buildWhere(where: Where = {}, extra?: Extra) {
    const parts: string[] = [];
    const params: SQLiteBindValue[] = [];

    for (const [col, val] of Object.entries(where)) {
        const c = ident(col);
        if (Array.isArray(val)) {
            if (val.length === 0) { parts.push("0"); continue; }  // IN () matches nothing
            parts.push(`${c} IN (${val.map(() => "?").join(",")})`);
            params.push(...val);
        } else if (val === null) {
            parts.push(`${c} IS NULL`);
        } else {
            parts.push(`${c} = ?`);
            params.push(val);
        }
    }
    if (extra) {
        parts.push(`(${extra.sql})`);
        params.push(...(extra.params ?? []));
    }
    return { sql: parts.length ? ` WHERE ${parts.join(" AND ")}` : "", params, isEmpty: parts.length === 0 };
}

// ═════════════════════════════ CREATE ═════════════════════════════

/** Insert ONE row. Returns the new rowid. */
export async function insertOne(
    table: string,
    row: Row,
    opts: { orReplace?: boolean; orIgnore?: boolean; db?: Db } = {}
): Promise<number> {

    const cols = Object.keys(row).map(ident);
    const verb = opts.orReplace ? "INSERT OR REPLACE" : opts.orIgnore ? "INSERT OR IGNORE" : "INSERT";
    const db = opts.db ?? (await getDb());
    const res = await db.runAsync(
        `${verb} INTO ${ident(table)} (${cols.join(",")}) VALUES (${cols.map(() => "?").join(",")})`,
        cols.map((c) => row[c] ?? null)
    );
    return res.lastInsertRowId;
}

/** Insert MANY rows: one transaction + one prepared statement (fast, all-or-nothing). Columns come from the first row. */
export async function insertMany(
    table: string,
    rows: Row[],
    opts: { orReplace?: boolean; orIgnore?: boolean; db?: Db } = {}
): Promise<number> {
    if (!rows.length) return 0;
    const cols = Object.keys(rows[0]!).map(ident);
    const verb = opts.orReplace ? "INSERT OR REPLACE" : opts.orIgnore ? "INSERT OR IGNORE" : "INSERT";
    const sql = `${verb} INTO ${ident(table)} (${cols.join(",")}) VALUES (${cols.map(() => "?").join(",")})`;

    return inTx(opts.db, async (d) => {
        const stmt = await d.prepareAsync(sql);
        try {
            for (const row of rows) await stmt.executeAsync(cols.map((c) => row[c] ?? null));
        } finally {
            await stmt.finalizeAsync();
        }
        return rows.length;
    });
}

function upsertSql(table: string, cols: string[], conflict: string, exclude: string[]) {
    const updates = cols
        .filter((c) => c !== conflict && !exclude.includes(c))
        .map((c) => `${c} = excluded.${c}`);
    return (
        `INSERT INTO ${ident(table)} (${cols.join(",")}) VALUES (${cols.map(() => "?").join(",")}) ` +
        `ON CONFLICT(${ident(conflict)}) ` +
        (updates.length ? `DO UPDATE SET ${updates.join(", ")}` : "DO NOTHING")
    );
}

/** Insert or update ONE row, keyed by a UNIQUE/PRIMARY KEY column. `exclude` columns are never overwritten. */
export async function upsertOne(
    table: string,
    row: Row,
    opts: { conflict: string; exclude?: string[]; db?: Db }
) {
    const cols = Object.keys(row).map(ident);
    const db = opts.db ?? (await getDb());
    await db.runAsync(upsertSql(table, cols, opts.conflict, opts.exclude ?? []), cols.map((c) => row[c] ?? null));
}

/** Insert or update MANY rows in one transaction. */
export async function upsertMany(
    table: string,
    rows: Row[],
    opts: { conflict: string; exclude?: string[]; db?: Db }
) {
    if (!rows.length) return 0;
    const cols = Object.keys(rows[0]!).map(ident);
    const sql = upsertSql(table, cols, opts.conflict, opts.exclude ?? []);

    return inTx(opts.db, async (d) => {
        const stmt = await d.prepareAsync(sql);
        try {
            for (const row of rows) await stmt.executeAsync(cols.map((c) => row[c] ?? null));
        } finally {
            await stmt.finalizeAsync();
        }
        return rows.length;
    });
}

// ═════════════════════════════ READ ═════════════════════════════

export interface FindOptions {
    where?: Where;
    extra?: Extra;
    orderBy?: string;           // "created_at DESC, local_id DESC"
    limit?: number;
    offset?: number;
    columns?: string[];
    db?: Db;
}

/** Find MANY rows. */
export async function findMany<T = Row>(table: string, opts: FindOptions = {}): Promise<T[]> {
    const { sql: whereSql, params } = buildWhere(opts.where, opts.extra);
    const cols = opts.columns ? opts.columns.map(ident).join(",") : "*";
    let sql = `SELECT ${cols} FROM ${ident(table)}${whereSql}`;

    if (opts.orderBy) {
        if (!ORDER.test(opts.orderBy)) throw new Error(`Unsafe ORDER BY: ${opts.orderBy}`);
        sql += ` ORDER BY ${opts.orderBy}`;
    }
    if (opts.limit != null) {
        sql += ` LIMIT ${Math.max(0, Math.floor(opts.limit))}`;
        if (opts.offset) sql += ` OFFSET ${Math.max(0, Math.floor(opts.offset))}`;
    }
    const db = opts.db ?? (await getDb());
    return db.getAllAsync<T>(sql, params);
}

/** Find ONE row (or null). */
export async function findOne<T = Row>(
    table: string,
    where: Where,
    opts: Omit<FindOptions, "where" | "limit" | "offset"> = {}
): Promise<T | null> {
    const rows = await findMany<T>(table, { ...opts, where, limit: 1 });
    return rows[0] ?? null;
}

export async function count(table: string, where: Where = {}, extra?: Extra, db?: Db): Promise<number> {
    const w = buildWhere(where, extra);
    const d = db ?? (await getDb());
    const row = await d.getFirstAsync<{ n: number }>(`SELECT COUNT(*) AS n FROM ${ident(table)}${w.sql}`, w.params);
    return row?.n ?? 0;
}

export async function exists(table: string, where: Where, db?: Db): Promise<boolean> {
    return (await count(table, where, undefined, db)) > 0;
}

// ═════════════════════════════ UPDATE ═════════════════════════════

function buildSet(set: Row) {
    const cols = Object.keys(set).map(ident);
    if (!cols.length) throw new Error("update: nothing to set");
    return { sql: cols.map((c) => `${c} = ?`).join(", "), params: cols.map((c) => set[c] ?? null) };
}

/** Update ONE row (the first match). Returns true if a row changed. */
export async function updateOne(table: string, set: Row, where: Where, db?: Db): Promise<boolean> {
    const s = buildSet(set);
    const w = buildWhere(where);
    if (w.isEmpty) throw new Error("updateOne: refusing to run without a WHERE");
    const d = db ?? (await getDb());
    const res = await d.runAsync(
        `UPDATE ${ident(table)} SET ${s.sql} WHERE rowid = (SELECT rowid FROM ${ident(table)}${w.sql} LIMIT 1)`,
        [...s.params, ...w.params]
    );
    return res.changes > 0;
}

/** Update MANY rows with the SAME values (e.g. mark everything in a chat as read). Returns rows changed. */
export async function updateWhere(
    table: string,
    set: Row,
    where: Where,
    extra?: Extra,
    db?: Db
): Promise<number> {
    const s = buildSet(set);
    const w = buildWhere(where, extra);
    if (w.isEmpty) throw new Error("updateWhere: refusing to run without a WHERE");
    const d = db ?? (await getDb());
    const res = await d.runAsync(`UPDATE ${ident(table)} SET ${s.sql}${w.sql}`, [...s.params, ...w.params]);
    return res.changes;
}

/** Update MANY rows with DIFFERENT values each: every row carries its key column + the columns to change. */
export async function updateEach(
    table: string,
    rows: Row[],
    opts: { key: string; db?: Db }
): Promise<number> {
    if (!rows.length) return 0;
    const key = ident(opts.key);
    const cols = Object.keys(rows[0]!).filter((c) => c !== key).map(ident);
    if (!cols.length) throw new Error("updateEach: nothing to set");
    const sql = `UPDATE ${ident(table)} SET ${cols.map((c) => `${c} = ?`).join(", ")} WHERE ${key} = ?`;

    return inTx(opts.db, async (d) => {
        const stmt = await d.prepareAsync(sql);
        try {
            for (const row of rows) await stmt.executeAsync([...cols.map((c) => row[c] ?? null), row[key] ?? null]);
        } finally {
            await stmt.finalizeAsync();
        }
        return rows.length;
    });
}

// ═════════════════════════════ DELETE ═════════════════════════════

/** Delete ONE row (the first match). */
export async function deleteOne(table: string, where: Where, db?: Db): Promise<boolean> {
    const w = buildWhere(where);
    if (w.isEmpty) throw new Error("deleteOne: refusing to run without a WHERE");
    const d = db ?? (await getDb());
    const res = await d.runAsync(
        `DELETE FROM ${ident(table)} WHERE rowid = (SELECT rowid FROM ${ident(table)}${w.sql} LIMIT 1)`,
        w.params
    );
    return res.changes > 0;
}

/** Delete MANY rows matching the filter. */
export async function deleteWhere(table: string, where: Where, extra?: Extra, db?: Db): Promise<number> {
    const w = buildWhere(where, extra);
    if (w.isEmpty) throw new Error("deleteWhere: refusing to run without a WHERE (use truncate)");
    const d = db ?? (await getDb());
    return (await d.runAsync(`DELETE FROM ${ident(table)}${w.sql}`, w.params)).changes;
}

/** Delete MANY rows by id list, in chunks of 500 so we never hit SQLite's bound-parameter limit. */
export async function deleteByIds(
    table: string,
    column: string,
    ids: SQLiteBindValue[],
    db?: Db
): Promise<number> {
    if (!ids.length) return 0;
    return inTx(db, async (d) => {
        let total = 0;
        for (const part of chunk(ids)) {
            const res = await d.runAsync(
                `DELETE FROM ${ident(table)} WHERE ${ident(column)} IN (${part.map(() => "?").join(",")})`,
                part
            );
            total += res.changes;
        }
        return total;
    });
}

/** Explicitly delete EVERYTHING in a table. */
export async function truncate(table: string, db?: Db) {
    const d = db ?? (await getDb());
    await d.runAsync(`DELETE FROM ${ident(table)}`);
}