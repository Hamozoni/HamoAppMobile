
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

    async getContact(id: string) {
        return contactsRepository.findById(id);
    },

    async saveContact(data: {
        _id: string;
        phoneNumber: string;
        countryCode: string;
        countryISO: string;
        displayName?: string;
    }) {
        const existing = await contactsRepository.findById(data._id);

        if (existing) {
            return contactsRepository.update(data._id, data);
        }

        return contactsRepository.create(data);
    },

    async deleteContact(id: string) {
        return contactsRepository.delete(id);
    },
};
