import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ImagePickerAsset } from 'expo-image-picker';
import { useProfilePictureSignature } from './useProfilePicureSignature';
import { uploadImageToCloudinary, CloudinaryUploadResponse } from '../../services/cloudinary.service';

export const useCloudinaryUpload = (endPoint: string) => {
    const [progress, setProgress] = useState<number>(0);
    const { mutateAsync: fetchSignature } = useProfilePictureSignature();

    const mutation = useMutation<CloudinaryUploadResponse, Error, ImagePickerAsset>({
        mutationFn: async (asset: ImagePickerAsset) => {
            setProgress(0);

            const signature = await fetchSignature({ endPoint, mediaType: asset.mimeType?.split('/')[0] });
            if (!signature) {
                throw new Error('Failed to retrieve upload signature from backend.');
            }

            return await uploadImageToCloudinary(asset, signature, (currentProgress) => {
                setProgress(currentProgress);
            });
        },
    });

    return {
        ...mutation,
        progress,
    };
};