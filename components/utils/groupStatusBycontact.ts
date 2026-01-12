import { Status, Contact } from '../../types/components.types';

interface StatusWithContact extends Status {
    contact: Contact;
}

interface GroupedStatus {
    [contactId: string]: StatusWithContact[];
}

export const groupStatusByContact = (statuses: StatusWithContact[]): StatusWithContact[][] => {
    const grouped = statuses.reduce<GroupedStatus>((acc, status) => {
        const contactId = status.contact.id;

        if (contactId) {
            if (!acc[contactId]) {
                acc[contactId] = [];
            }
            acc[contactId].push(status);
        }

        return acc;
    }, {});

    return Object.values(grouped);
}
