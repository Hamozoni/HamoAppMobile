
import * as FileSystem from 'expo-file-system/legacy';
import { filesRepository } from '../repositories';

export const filesService = {
    // Save file metadata
    async createFile(data: {
        clientFileId?: string;
        onwerId: string;
        type: string;
        purpose?: string;
        localUri?: string;
        mimeType?: string;
        size?: number;
        width?: number;
        height?: number;
        duration?: number;
        metadata?: string;
    }) {
        const clientFileId =
            data.clientFileId ?? crypto.randomUUID();

        await filesRepository.create({
            clientFileId,
            onwerId: data.onwerId,
            type: data.type,
            purpose: data.purpose,
            localUri: data.localUri,
            mimeType: data.mimeType,
            size: data.size,
            width: data.width,
            height: data.height,
            duration: data.duration,
            metadata: data.metadata,
            downloaded: 0,
        });

        return filesRepository.findById(clientFileId);
    },

    // Get file
    async getFile(fileId: string) {
        return filesRepository.findById(fileId);
    },

    // Get all files
    async getAllFiles() {
        return filesRepository.findAll();
    },

    // Delete file
    async deleteFile(fileId: string) {
        const file = await filesRepository.findById(fileId);

        if (!file) return;

        // Delete local physical file
        if (file.localUri) {
            const info = await FileSystem.getInfoAsync(file.localUri);

            if (info.exists) {
                await FileSystem.deleteAsync(file.localUri, {
                    idempotent: true,
                });
            }
        }

        // Delete thumbnail
        if (file.thumbnailLocalUri) {
            const info = await FileSystem.getInfoAsync(
                file.thumbnailLocalUri
            );

            if (info.exists) {
                await FileSystem.deleteAsync(
                    file.thumbnailLocalUri,
                    { idempotent: true }
                );
            }
        }

        return filesRepository.delete(fileId);
    },

    // Update file metadata
    async updateFile(
        fileId: string,
        data: Record<string, any>
    ) {
        return filesRepository.update(fileId, data);
    },

    // Download remote file
    async downloadFile(
        fileId: string,
        secureUrl: string
    ) {
        const file = await filesRepository.findById(fileId);

        if (!file) {
            throw new Error('File not found');
        }

        const directory = `${FileSystem.documentDirectory}media/`;

        await FileSystem.makeDirectoryAsync(directory, {
            intermediates: true,
        });

        const extension = file.format ?? 'bin';
        const destination = `${directory}${fileId}.${extension}`;

        const result = await FileSystem.downloadAsync(
            secureUrl,
            destination
        );

        await filesRepository.update(fileId, {
            localUri: result.uri,
            downloaded: 1,
            downloadedAt: Date.now(),
        });

        return result.uri;
    },

    // Check if file exists locally
    async isDownloaded(fileId: string) {
        const file = await filesRepository.findById(fileId);

        if (!file?.localUri) return false;

        const info = await FileSystem.getInfoAsync(file.localUri);

        return info.exists;
    },

    // Get local file URI
    async getLocalUri(fileId: string) {
        const file = await filesRepository.findById(fileId);

        if (!file?.localUri) return null;

        const info = await FileSystem.getInfoAsync(file.localUri);

        return info.exists ? file.localUri : null;
    },

    // Clear downloaded media
    async clearDownloadedFiles() {
        const allFiles = await filesRepository.findAll();

        for (const file of allFiles) {
            if (file.downloaded && file.localUri) {
                const info = await FileSystem.getInfoAsync(file.localUri);

                if (info.exists) {
                    await FileSystem.deleteAsync(file.localUri, {
                        idempotent: true,
                    });
                }

                await filesRepository.update(file.clientFileId, {
                    localUri: null,
                    downloaded: 0,
                    downloadedAt: null,
                });
            }
        }
    },
};
