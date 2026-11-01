
// src/db/index.ts
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const db_name = __DEV__ ? "sudachat_dev.db" : "sudachat.db"

export const expoDb = openDatabaseSync(db_name, { enableChangeListener: true });
expoDb.execSync("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
export const db = drizzle(expoDb, { schema });