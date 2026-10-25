// import axios from 'axios';
// import { ImagePickerAsset } from 'expo-image-picker';

// export interface CloudinarySignature {
//     uploadUrl: string;
//     publicId: string;
//     signature: string;
//     timestamp: number;
//     apiKey: string;
//     folder: string;
//     cloudName: string;
//     overwrite: boolean;
//     invalidate: boolean;
// }

export interface CloudinaryUploadResponse {
    public_id: string;
    secure_url: string;
    format?: string;
    width: number;
    height: number;
    bytes: number;
    resource_type: string;
    duration?: number;
}

import axios from "axios";
// export const uploadImageToCloudinary = async (
//     asset: ImagePickerAsset,
//     signature: CloudinarySignature,
//     onProgress?: (progress: number) => void
// ): Promise<CloudinaryUploadResponse> => {

//     const extension = asset.uri.split('.').pop() || 'jpg';
//     const filename = asset.fileName || `avatar_${Date.now()}.${extension}`;
//     const mimeType = asset.mimeType || `image/${extension}`;

//     const formData = new FormData();

//     formData.append('file', {
//         uri: asset.uri,
//         type: mimeType,
//         name: filename,
//     } as any);

//     formData.append('public_id', signature?.publicId);
//     formData.append('signature', signature?.signature);
//     formData.append('timestamp', signature?.timestamp?.toString());
//     formData.append('api_key', signature?.apiKey);
//     formData.append('folder', signature?.folder);
//     formData.append('cloud_name', signature?.cloudName);
//     formData.append('overwrite', signature?.overwrite?.toString());
//     formData.append('invalidate', signature?.invalidate?.toString());

//     const { data } = await axios.post<CloudinaryUploadResponse>(
//         signature.uploadUrl,
//         formData,
//         {
//             headers: { 'Content-Type': 'multipart/form-data' },
//             onUploadProgress: (progressEvent) => {
//                 if (progressEvent.total) {
//                     const percentCompleted = Math.round(
//                         (progressEvent.loaded * 100) / progressEvent.total
//                     );
//                     onProgress?.(percentCompleted);
//                 }
//             },
//         }
//     );

//     console.log('cloudinary upload response: ', data);

//     return data;
// };

import { Platform } from "react-native";

export interface UploadSignature {
    signature: string;
    timestamp: number;
    apiKey: string;
    folder: string;
    uploadUrl: string;
    maxFileSize?: number;
    publicId?: string;
    overwrite?: boolean;
    invalidate?: boolean;
}

export interface NativeFile {
    uri: string;      // from expo-image-picker / document-picker / camera
    name?: string;    // e.g. "photo.jpg"
    mimeType?: string; // e.g. "image/jpeg"
    size?: number;
}

function guessName(file: NativeFile) {
    if (file.name) return file.name;
    const last = file.uri.split("/").pop();
    return last && last.includes(".") ? last : `upload-${Date.now()}`;
}

/**
 * Uses fetch (not your axios instance) on purpose:
 * - your axios instance likely adds an Authorization header / baseURL
 *   via interceptors, which Cloudinary must NOT receive
 * - fetch sets the multipart boundary correctly in React Native
 *
 * Do NOT set the Content-Type header manually.
 */
export async function uploadToCloudinary(file: NativeFile, sig: UploadSignature): Promise<CloudinaryUploadResponse> {
    if (sig.maxFileSize && file.size && file.size > sig.maxFileSize) {
        throw new Error(`File too large. Max ${Math.round(sig.maxFileSize / 1024 / 1024)}MB`);
    }

    const uri =
        Platform.OS === "android" && !file.uri.startsWith("file://") && !file.uri.startsWith("content://")
            ? `file://${file.uri}`
            : file.uri;

    const form = new FormData();

    // React Native's FormData accepts { uri, name, type }
    form.append("file", {
        uri,
        name: guessName(file),
        type: file.mimeType || "application/octet-stream",
    } as any);

    // ONLY the fields that were signed on the server
    form.append("api_key", sig.apiKey);
    form.append("timestamp", String(sig.timestamp));
    form.append("signature", sig.signature);
    form.append("folder", sig.folder);
    if (sig.publicId) form.append("public_id", sig.publicId);
    if (sig.overwrite !== undefined) form.append("overwrite", String(sig.overwrite));
    if (sig.invalidate !== undefined) form.append("invalidate", String(sig.invalidate));

    try {
        const { data } = await axios.post(sig.uploadUrl, form, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e) => {
                // if (onprogress && e.total) onprogress(Math.round((e.loaded * 100) / e.total));

                console.log("progress: ", e);
            },
        });
        return data;
    } catch (err: any) {
        console.log("Cloudinary status:", err.response?.status);
        console.log("Cloudinary error:", JSON.stringify(err.response?.data));
        throw new Error(err.response?.data?.error?.message ?? err.message);
    }
}