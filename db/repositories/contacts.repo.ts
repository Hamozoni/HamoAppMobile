import { executeBatch, executeQuery, executeUpdate } from "../index";

export function upsertContacts(rows: any[]) {
    executeBatch(
        `
    INSERT OR REPLACE INTO contacts (
      _id,
      phoneNumber,
      about,
      countryCode,
      countryISO,
      displayName,
      isRegistered,
      profilePicture
    ) VALUES (?,?,?,?,?,?,?,?)
    `,
        rows.map(c => [
            c._id,
            c.phoneNumber,
            c.about,
            c.countryCode,
            c.countryISO,
            c.displayName,
            c.isRegistered ? 1 : 0,
            c.profilePicture ?? null
        ])
    );
}

export function getRegisteredContacts() {
    return executeQuery(
        "SELECT * FROM contacts WHERE isRegistered = 1 ORDER BY displayName"
    );
};

export function clearContacts() {
    executeUpdate("DELETE FROM contacts;");
}

export function getAllContacts() {
    return executeQuery(
        "SELECT * FROM contacts ORDER BY displayName"
    );
}
