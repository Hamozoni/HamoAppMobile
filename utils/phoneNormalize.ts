import { parsePhoneNumberFromString } from "libphonenumber-js";

export function normalizePhone(
    raw: string,
    countryISO: any
): string | null {
    try {
        const phone = parsePhoneNumberFromString(raw, countryISO);
        return phone?.isValid() ? phone.number : null; // E.164
    } catch {
        return null;
    }
}
