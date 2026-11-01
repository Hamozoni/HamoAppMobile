
import { outboxRepository } from '../repositories';

export const outboxService = {
    async getPendingMessages() {
        return outboxRepository.findPending();
    },

    async markAsProcessing(id: string) {
        return outboxRepository.update(id, {
            status: 'processing',
        });
    },

    async markAsSent(id: string) {
        return outboxRepository.delete(id);
    },

    async markAsFailed(
        id: string,
        error: string,
        attempts: number,
    ) {
        const delay = Math.min(
            1000 * 2 ** attempts,
            60000
        );

        return outboxRepository.update(id, {
            status: 'pending',
            attempts,
            lastError: error,
            nextAttemptAt: Date.now() + delay,
        });
    },
};
