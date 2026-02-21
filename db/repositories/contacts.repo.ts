import { executeBatch, executeQuery, executeUpdate } from "../index";
import type { Contact } from "../types/contact.type";

export function upsertContacts(rows: Contact[]): void {
    if (rows.length === 0) return;

    executeBatch(
        `INSERT OR REPLACE INTO contacts 
            (_id, phoneNumber, about, countryCode, countryISO, displayName, isRegistered, profilePicture)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        rows.map(c => [
            c._id,
            c.phoneNumber,
            c.about ?? null,
            c.countryCode ?? null,
            c.countryISO ?? null,
            c.displayName,
            c.isRegistered ? 1 : 0,
            c.profilePicture ?? null,
        ])
    );
}

export function updateContact(c: Contact): void {
    executeUpdate(
        `UPDATE contacts SET
            _id            = ?,
            about          = ?,
            isRegistered   = ?,
            profilePicture = ?,
            displayName    = ?,
            countryCode    = ?,
            countryISO     = ?
         WHERE phoneNumber = ?`,
        [
            c._id,
            c.about ?? null,
            c.isRegistered ? 1 : 0,
            c.profilePicture ?? null,
            c.displayName,
            c.countryCode ?? null,
            c.countryISO ?? null,
            c.phoneNumber,
        ]
    );
}

export function getRegisteredContacts(): Contact[] {
    return executeQuery<Contact>(
        "SELECT * FROM contacts WHERE isRegistered = 1 ORDER BY displayName"
    );
}

export function getUnregisteredContacts(): Contact[] {
    return executeQuery<Contact>(
        "SELECT * FROM contacts WHERE isRegistered = 0 ORDER BY displayName"
    );
}

export function clearContacts(): void {
    executeUpdate("DELETE FROM contacts;");
}
