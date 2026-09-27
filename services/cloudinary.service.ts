import axios from 'axios';
import { ImagePickerAsset } from 'expo-image-picker';

export interface CloudinarySignature {
    uploadUrl: string;
    publicId: string;
    signature: string;
    timestamp: number;
    apiKey: string;
    folder: string;
    cloudName: string;
    overwrite: boolean;
    invalidate: boolean;
}

export interface CloudinaryUploadResponse {
    public_id: string;
    secure_url: string;
    url: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    [key: string]: any;
}

export const uploadImageToCloudinary = async (
    asset: ImagePickerAsset,
    signature: CloudinarySignature,
    onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResponse> => {
    const extension = asset.uri.split('.').pop() || 'jpg';
    const filename = asset.fileName || `avatar_${Date.now()}.${extension}`;
    const mimeType = asset.mimeType || `image/${extension}`;

    const formData = new FormData();

    formData.append('file', {
        uri: asset.uri,
        type: mimeType,
        name: filename,
    } as any);

    formData.append('public_id', signature.publicId);
    formData.append('signature', signature.signature);
    formData.append('timestamp', signature.timestamp.toString());
    formData.append('api_key', signature.apiKey);
    formData.append('folder', signature.folder);
    formData.append('cloud_name', signature.cloudName);
    formData.append('overwrite', signature.overwrite.toString());
    formData.append('invalidate', signature.invalidate.toString());

    const { data } = await axios.post<CloudinaryUploadResponse>(
        signature.uploadUrl,
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress?.(percentCompleted);
                }
            },
        }
    );

    return data;
};