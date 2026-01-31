import { executeQuery, executeQueryFirst, executeUpdate, executeBatch } from '../index';

export class ContactsRepository {

    static getAll(): any[] {
        return executeQuery<any>(
            `SELECT * FROM contacts ORDER BY displayName ASC`
        );
    }

    static getById(_id: number): any | null {
        return executeQueryFirst<any>(
            `SELECT * FROM contacts WHERE _id = ?`,
            [_id]
        );
    }

    static search(query: string): any[] {
        return executeQuery<any>(
            `SELECT * FROM contacts 
                WHERE displayName LIKE ? OR phoneNumber LIKE ?
                ORDER BY displayName ASC`,
            [`%${query}%`, `%${query}%`]
        );
    }

    // static create(contact: any): number {
    //     const result = executeUpdate(
    //         `INSERT INTO contacts (_id, phoneNumber, countryCode, countryISO, displayName, about, profilePicture, lastSeen, isOnline, isBlocked,isRegistered)
    //            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?`,
    //         [
    //             contact._id,
    //             contact.phoneNumber,
    //             contact.countryCode,
    //             contact.countryISO,
    //             contact.displayName,
    //             contact.about || null,
    //             contact.profilePicture || null,
    //             contact.lastSeen || null,
    //             contact.isOnline || false,
    //             contact.isBlocked || false,
    //             contact.isRegistered || false,
    //         ]
    //     );
    //     return result.lastInsertRowId!;
    // }


    static batchUpdate(contacts: any[]): void {
        const params = contacts.map(c => [
            c._id,
            c.phoneNumber,
            c.countryCode,
            c.countryISO,
            c.displayName,
            c.about || null,
            c.profilePicture || null,
            c.lastSeen || null,
            c.isOnline || false,
            c.isBlocked || false,
            c.isRegistered || false,
            Date.now()
        ]);

        executeBatch(
            `INSERT INTO contacts (_id, phoneNumber, diplayName, profilePicture, about, lastSeen, isOnline, isBlocked,isRegistered)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
                ON CONFLICT(_id) DO UPDATE SET
                    phoneNumber = excluded.phoneNumber ,
                    countryCode = excluded.countryCode,
                    countryISO = excluded.countryISO,
                    displayName = excluded.displayName,
                    about = excluded.about,
                    profilePicture = excluded.profilePicture,
                    lastSeen = excluded.lastSeen,
                    isOnline = excluded.isOnline,
                    isBlocked = excluded.isBlocked,
                    isRegistered = excluded.isRegistered
            `, params
        );
    }

    static delete(_id: number): void {
        executeUpdate(`DELETE FROM contacts WHERE _id = ?`, [_id]);
    }
}