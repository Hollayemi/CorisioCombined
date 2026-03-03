import Button from "@/components/form/Button";
import ProgressHeader from "@/components/wrapper/business/headers/authHeader";
import useImageUploader from "@/hooks/useStoreImageUploader";
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { PageHeader, ProfileGuidelines, ProfilePictureUpload } from "./component";

// Screen 4: Set Up Profile Picture
export default function SetUpProfilePictureScreen() {
    const [profileImage, setProfileImage] = useState([]);
    const { handleUpload, localFiles, uploading } = useImageUploader("store_image", setProfileImage)
    console.log("profileImage=>>>>>>>", profileImage)
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <ProgressHeader
                currentStep={5}
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="pt-6">
                    <PageHeader
                        title="Set Up Your Profile Picture"
                        subtitle="Make a great first impression by adding a clear and professional profile picture or your brand logo."
                    />

                    <View className="px-6 mt-5">
                        <ProfileGuidelines />

                        <ProfilePictureUpload
                            localFiles={localFiles}
                            handleUpload={handleUpload}
                        />
                    </View>
                </View>
            </ScrollView>

            <View className="px-6 pb-6 pt-4">
                <Button
                    title="Complete Profile Setup"
                    onPress={async () => { router.push({ pathname: "/business/auth/map", params: { type: 'registration' } }); }}
                    className="w-full"
                    isLoading={uploading}
                // disabled={!profileImage}
                />
            </View>
        </SafeAreaView>
    );
};