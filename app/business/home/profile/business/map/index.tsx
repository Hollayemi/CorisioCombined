// screens/PersonalInformationScreen.tsx
import Button from '@/components/form/Button';
import StoreWrapper from '@/components/wrapper/business';
import { useStoreData } from '@/hooks/useData';
import useImageUploader from '@/hooks/useStoreImageUploader';
import { useUpdateStaffDetailsMutation } from '@/redux/business/slices/staffSlice';
import { ImagePlusIcon, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

interface personalInfo {
    fullname: string;
    phone: string;
    email: string;
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
                className={`bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white ${multiline ? 'min-h-[80px]' : ''
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
    const { staffInfo, storeInfo, refetchStaff, staffIsLoading }: any = useStoreData();
    const [profileImage, setProfileImage] = useState([]);
    const { handleUpload, localFiles, uploading } = useImageUploader("staff_image", setProfileImage)
    const [updateStaffDetails, { isLoading }] = useUpdateStaffDetailsMutation()
    const { fullname, phone, staffEmail, staffRole, picture } = staffInfo || {};
    const [personalInfo, setpersonalInfo] = useState<personalInfo>({
        fullname: fullname || '',
        phone: phone || '',
        email: staffEmail || '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const handleSave = () => {
        updateStaffDetails(personalInfo).then(() => refetchStaff())
        setIsEditing(false);
    };
    const isDark = useColorScheme() === 'dark'

    return (
        <StoreWrapper headerTitle="Store Location" active='profile'>
            <ScrollView refreshControl={<RefreshControl refreshing={staffIsLoading} onRefresh={refetchStaff} />} className="flex-1 bg-gray-50 dark:bg-gray-900">
                <View className="p-4">
                    {/* Profile Picture Section */}
                    <View className="flex-row items-center mb-8">

                        <View className="relative">
                            <View className={`w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center overflow-hidden`}>
                                {picture || profileImage.length ? (
                                    <Image
                                        source={{
                                            uri: profileImage[profileImage.length - 1] || picture
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
                                        Change Personal Picture
                                    </Text>
                                </> : <ActivityIndicator />}
                        </TouchableOpacity>
                    </View>

                    {/* Business Information Form */}
                    <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
                        <InfoField
                            label="Your Name"
                            value={personalInfo.fullname}
                            field="fullname"
                            setpersonalInfo={setpersonalInfo}
                            isEditing={isEditing}
                        />

                        <InfoField
                            label="Phone Number"
                            value={personalInfo.phone}
                            field="phone"
                            setpersonalInfo={setpersonalInfo}
                            isEditing={isEditing}
                        />

                        <InfoField
                            label="Email Address"
                            value={personalInfo.email}
                            field="email"
                            setpersonalInfo={setpersonalInfo}
                            isEditing={isEditing}
                        />


                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Role
                        </Text>
                        <View className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 min-h-[48px] justify-center">
                            <Text className="text-gray-900 capitalize dark:text-white">
                                {staffRole?.replaceAll("_", " ")}
                            </Text>
                        </View>
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
        </StoreWrapper>
    );
};

export default PersonalInformationScreen;