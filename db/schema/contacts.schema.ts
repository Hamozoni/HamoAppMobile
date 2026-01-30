

const CONTACTS_SCHEMA = `
CREATE TABLE IF NOT EXISTS contacts (
    _id TEXT PRIMARY KEY,
    phoneNumber TEXT,
    countryCode TEXT,
    countryISO TEXT,
    displayName TEXT,
    about TEXT,
    profilePicture TEXT,
    lastSeen DATETIME,
    isOnline BOOLEAN,
    isBlocked BOOLEAN,
    isRequested BOOLEAN,
)`

export default CONTACTS_SCHEMA;

