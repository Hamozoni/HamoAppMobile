import { executeBatch, executeQuery } from "../index";

export function upsertContacts(rows: any[]) {
    executeBatch(
        `
    INSERT OR REPLACE INTO contacts (
      _id,
      phoneNumber,
      phoneE164,
      countryCode,
      countryISO,
      displayName,
      isRegistered,
      userId,
      profilePicture
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        rows.map(c => [
            c._id,
            c.phoneNumber,
            c.phoneE164,
            c.countryCode,
            c.countryISO,
            c.displayName,
            c.isRegistered ? 1 : 0,
            c.userId ?? null,
            c.profilePicture ?? null
        ])
    );
}

export function getRegisteredContacts() {
    return executeQuery(
        "SELECT * FROM contacts WHERE isRegistered = 1 ORDER BY displayName"
    );
}

export function getAllContacts() {
    return executeQuery(
        "SELECT * FROM contacts ORDER BY displayName"
    );
}
