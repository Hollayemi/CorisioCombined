import toaster from "@/config/toaster";
import { useUpdateProfilePictureMutation } from "@/redux/user/slices/userSlice2";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useUserData } from "./useData";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

type ImageUploadType = "gallery" | "profile_image" | 'staff_image';

export default function useImageUploader() {
    const [files, setFiles] = useState<string[]>([]);
    const [localFiles, setLocalFiles] = useState<string[]>([]);
    const { refetchUser }: any = useUserData()
    const [imageUploader, { isLoading }] = useUpdateProfilePictureMutation();

    const handleUpload = async (type: ImageUploadType, max: number) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: max > 1,
            quality: 0.8,
            base64: true, // Add this to get base64 data
        });

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
                        picture: dataUri,
                        state: "add",
                        type,
                    }).then(() => refetchUser())
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
