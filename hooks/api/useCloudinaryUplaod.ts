import { useMutation } from '@tanstack/react-query';
import { ImagePickerAsset } from 'expo-image-picker';
import { useCloudinarySignature } from './useCloudinarySignature';
import { uploadToCloudinary, CloudinaryUploadResponse } from '../../services/cloudinary.service';

export const useCloudinaryUpload = (endPoint: string) => {

    const { mutateAsync: fetchSignature } = useCloudinarySignature();

    const mutation = useMutation<CloudinaryUploadResponse, Error, ImagePickerAsset>({
        mutationFn: async (asset: ImagePickerAsset) => {

            const signature = await fetchSignature({ endPoint, mediaType: asset.mimeType?.split('/')[0] });

            console.log({ signature })
            if (!signature) {
                throw new Error('Failed to retrieve upload signature from backend.');
            };



            const cloudinaryData = await uploadToCloudinary(asset, signature);

            console.log({ cloudinaryData })

            return cloudinaryData;
        },
    });

    return {
        ...mutation,
    };
};