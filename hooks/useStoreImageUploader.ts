import toaster from "@/config/toaster";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useStoreData } from "./useData";
import { useUpdateUserProfilePicMutation, useUploadStorePhotoMutation } from "@/redux/business/slices/storeInfoSlice";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

type ImageUploadType = "gallery" | "store_image" | "staff_image";

export default function useImageUploader(image_type: ImageUploadType, setLocalFiles2?: any,) {
    const { refetchStore } = useStoreData()
    const [files, setFiles] = useState<string[]>([]);
    const [localFiles, setLocalFiles] = useState<string[]>([]);
    const [imageUploader, { isLoading }] = image_type === "staff_image" ? useUpdateUserProfilePicMutation() : useUploadStorePhotoMutation();

    const handleUpload = async (max: number) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: max > 1,
            quality: 0.8,
            base64: true, // Add this to get base64 data
        });
        !result.canceled && result.assets.forEach(async (asset) => {
            if (asset.fileSize && asset.fileSize < MAX_FILE_SIZE) {
                setLocalFiles2((prev: any) => [...prev, asset.uri]);
            }
        })
        if (!result.canceled) {
            result.assets.forEach(async (asset) => {
                if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
                    toaster({
                        type: "error",
                        message: `${asset.fileName} size too large`,
                    });
                } else {
                    const imageUri = asset.uri;
                    const base64 = asset.base64;

                    const mimeType = imageUri.split(".").pop() || "jpeg";
                    const dataUri = `data:image/${mimeType};base64,${base64}`;
                    await imageUploader({
                        image: dataUri,
                        state: "add",
                        type: image_type,
                    }).then(() => refetchStore())
                    setLocalFiles((prev: any) => [...prev, imageUri]);
                    setFiles((prev: any) => [...prev, dataUri]);
                }
            });
        }
    };

    return {
        handleUpload,
        files,
        localFiles,
        uploading: isLoading,
    };
}
