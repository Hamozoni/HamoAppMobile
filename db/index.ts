import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("sudachat.db");

export default db;