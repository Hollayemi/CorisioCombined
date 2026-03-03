// screens/PersonalInformationScreen.tsx
import { ProfilePictureUpload } from '@/app/business/auth/component';
import Button from '@/components/form/Button';
import StoreWrapper from '@/components/wrapper/business';
import { useStoreData } from '@/hooks/useData';
import useImageUploader from '@/hooks/useStoreImageUploader';
import { useUpdateStoreProfileMutation } from '@/redux/business/slices/storeInfoSlice';
import { ImagePlusIcon, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

interface personalInfo {
    storeName: string;
    phoneNumber: string;
    email: string;
    description: string;
    website: string;
}

const InfoField: React.FC<{ label: string; value: string; field: keyof personalInfo; multiline?: boolean, setpersonalInfo: any, isEditing: boolean }> = ({
    label,
    value,
    field,
    multiline = false,
    isEditing = false,
    setpersonalInfo
}) => (
    <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
        </Text>
        {isEditing ? (
            <TextInput
                value={value}
                onChangeText={(text) => setpersonalInfo((prev: any) => ({ ...prev, [field]: text }))}
                className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white ${multiline ? 'h-60 !min-h-[80px]' : ''
                    }`}
                multiline={multiline}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
        ) : (
            <View className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 min-h-[48px] justify-center">
                <Text className="text-gray-900 dark:text-white">
                    {value || "N/A"}
                </Text>
            </View>
        )}
    </View>
);

const PersonalInformationScreen: React.FC = () => {
    const { storeInfo, refetchStore, storeIsLoading }: any = useStoreData();
    const [profileImage, setProfileImage] = useState([]);
    const { handleUpload, localFiles, uploading } = useImageUploader("store_image", setProfileImage)
    const [updateStoreInfo, { isLoading }] = useUpdateStoreProfileMutation()
    const { storeName, profile_image, description, phoneNumber, email, website } = storeInfo.store || {};
    const [personalInfo, setpersonalInfo] = useState<personalInfo>({
        storeName: storeName || '',
        phoneNumber: phoneNumber || '',
        email: email || '',
        description: description || '',
        website: website || '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const handleSave = () => {
        updateStoreInfo(personalInfo).then(() => refetchStore())
        setIsEditing(false);
    };
    const isDark = useColorScheme() === 'dark'

    return (
        <StoreWrapper headerTitle="Store Information" active='profile'>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={storeIsLoading} onRefresh={refetchStore} />} className="flex-1 bg-gray-50 dark:bg-gray-900">
                    <View className="p-4">
                        {/* Profile Picture Section */}
                        <ProfilePictureUpload
                            localFiles={localFiles}
                            image={profile_image}
                            isUploading={uploading}
                            handleUpload={handleUpload}
                        />
                        {/* <View className="flex-row items-center mb-8">
                            <View className="relative">
                                <View className={`w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center overflow-hidden`}>
                                    {profile_image || profileImage.length ? (
                                        <Image
                                            source={{
                                                uri: profileImage[profileImage.length - 1] || profile_image
                                            }}
                                            className="w-full h-full "
                                        />
                                    ) : (
                                        <User
                                            size={40}
                                            color={isDark ? "#9ca3af" : "#333"}
                                        />

                                    )}
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => handleUpload(1)} className=" flex-1 bg-gray-300 py-3.5 ml-4 dark:bg-gray-800 rounded-full px-4 flex-row items-center justify-center">
                                {!uploading ?
                                    <>
                                        <ImagePlusIcon color={isDark ? "#9ca3af" : "#333"} />
                                        <Text className="text-gray-600 text-xl !ml-3 dark:text-gray-400 font-medium">
                                            Change Business Logo
                                        </Text>
                                    </> : <ActivityIndicator />}
                            </TouchableOpacity>
                        </View> */}

                        {/* Business Information Form */}
                        <View className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-6">
                            <InfoField
                                label="Your Name"
                                value={personalInfo.storeName}
                                field="storeName"
                                setpersonalInfo={setpersonalInfo}
                                isEditing={isEditing}
                            />

                            <InfoField
                                label="Business Phone Number"
                                value={personalInfo.phoneNumber}
                                field="phoneNumber"
                                setpersonalInfo={setpersonalInfo}
                                isEditing={isEditing}
                            />

                            <InfoField
                                label="Business Email Address"
                                value={personalInfo.email}
                                field="email"
                                setpersonalInfo={setpersonalInfo}
                                isEditing={isEditing}
                            />
                            <InfoField
                                label="Website URL"
                                value={personalInfo.website}
                                field="website"
                                setpersonalInfo={setpersonalInfo}
                                isEditing={isEditing}
                            />

                            <InfoField
                                label="About Store"
                                value={personalInfo.description}
                                field="description"
                                multiline
                                setpersonalInfo={setpersonalInfo}
                                isEditing={isEditing}
                            />

                        </View>

                        {/* Action Buttons */}
                        {isEditing ? (
                            <View className="flex-row space-x-3 gap-4 mb-6">
                                <Button title="Cancel" variant='outline' size="medium" className="flex-1 !min-w-48" onPress={() => setIsEditing(false)} />
                                <Button title="Save Changes" size="medium" className="flex-1 !min-w-48" onPress={handleSave} />
                            </View>
                        ) : (
                            <>
                                <Button title="Edit Information" size="medium" className="flex-1 !min-w-48" onPress={() => setIsEditing(true)} />

                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </StoreWrapper>
    );
};

export default PersonalInformationScreen;