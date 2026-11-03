
import { contactsRepository } from '../repositories';

export const contactsService = {
    async getContacts() {
        return contactsRepository.findAll();
    },

    async getRegisteredContacts() {
        return contactsRepository.findRegistered();
    },

    async searchContacts(query: string) {
        if (!query.trim()) {
            return contactsRepository.findAll();
        }

        return contactsRepository.search(query.trim());
    },

    async getContact(phoneNumber: string) {
        return contactsRepository.findByPhone(phoneNumber);
    },

    async saveContact(data: {
        _id: string;
        phoneNumber: string;
        countryCode: string;
        countryISO: string;
        displayName?: string;
    }) {
        const existing = await contactsRepository.findByPhone(data.phoneNumber);

        if (existing) {
            return contactsRepository.update(data.phoneNumber, data);
        }

        return contactsRepository.create(data);
    },

    async deleteContact(phoneNumber: string) {
        return contactsRepository.delete(phoneNumber);
    },
};
