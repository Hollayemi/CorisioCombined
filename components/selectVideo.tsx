// components/VideoUploader.tsx
import { ThemedPressable } from "@/components/ThemedPressable";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

type VideoUploaderProps = {
    onUpload: (uri: string) => void;
    onRemove: () => void;
    maxSizeMB?: number;
    currentVideo?: string;
};

export function VideoUploader({
    onUpload,
    onRemove,
    maxSizeMB = 10,
    currentVideo,
}: VideoUploaderProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const pickVideo = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: false,
                quality: 1,
            });

            if (result.canceled) return;

            const video = result.assets[0];

            // Check file size (10MB max)
            if (video.fileSize && video.fileSize > maxSizeMB * 1024 * 1024) {
                setError(`Video must be under ${maxSizeMB}MB`);
                return;
            }

            onUpload(video.uri);
        } catch (err) {
            setError("Failed to upload video");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [maxSizeMB]);

    const handleRemove = () => {
        Alert.alert(
            "Remove Video",
            "Are you sure you want to remove this video?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Remove", onPress: onRemove },
            ]
        );
    };

    return (
        <ThemedView className="mb-4">
            <ThemedText className="text-lg font-bold text-[#2C337C] mb-2">
                Product Video (Optional)
            </ThemedText>

            {currentVideo ? (
                <ThemedView className="relative">
                    <Video
                        source={{ uri: currentVideo }}
                        style={styles.videoPreview}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay={false}
                        isMuted
                        useNativeControls
                    />
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={handleRemove}
                    >
                        <Ionicons name="trash" size={20} color="white" />
                    </TouchableOpacity>
                </ThemedView>
            ) : (
                <>
                    <TouchableOpacity
                        onPress={pickVideo}
                        className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center"
                    >
                        <Ionicons name="videocam" size={24} color="#6B7280" />
                    </TouchableOpacity>
                   
                    <ThemedText className="text-gray-500 text-sm mt-1">
                        Max {maxSizeMB}MB
                    </ThemedText>
                </>
            )}

            {error && (
                <ThemedText className="text-red-500 mt-2">{error}</ThemedText>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    videoPreview: {
        width: "100%",
        height: 200,
        borderRadius: 8,
    },
    removeButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 20,
        padding: 5,
    },
});
