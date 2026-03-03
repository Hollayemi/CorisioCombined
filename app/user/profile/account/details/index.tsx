import Button from "@/components/form/Button";
import HomeWrapper from "@/components/wrapper/user";
import { useUserData } from "@/hooks/useData";
import useImageUploader from "@/hooks/useImageUploader";
import { useUpdateUserAccountMutation } from "@/redux/user/slices/userSlice2";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Details() {
    const { userInfo, refetchUser }: any = useUserData()
    const { handleUpload, localFiles, uploading } = useImageUploader();
    const [updateUser, { isLoading }] = useUpdateUserAccountMutation()
    const [localProfile, setProfileImage] = useState<any>({ uri: "" });
    const [inputValues, setValues] = useState({
        fullname: "",
        username: "",
    });

    useEffect(() => {
        setValues({
            fullname: userInfo?.fullname || "",
            username: userInfo?.username || ""
        });
    }, [userInfo]);

    const handleInputChange = (field: any, value: string) => {
        setValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <HomeWrapper active="profile" headerTitle="My Profile">
            <ScrollView className="flex-1 bg-white dark:bg-black px-4 py-5">

                <View className="items-center mb-6 mt-4">
                    <TouchableOpacity
                        onPress={() => handleUpload("profile_image", 1)}
                        className="relative mr-2 mb-2 border border-dashed border-gray-400 dark:border-slate-800 rounded-md bg-gray-100 dark:bg-slate-800"
                    >
                        {uploading ? (
                            <ActivityIndicator />
                        ) : (
                            localFiles?.[-1] ||
                            userInfo?.picture && <Image
                                source={{
                                    uri:
                                        localFiles?.[-1] ||
                                        userInfo?.picture,
                                }}
                                className="w-20 h-20 rounded-lg"
                            />
                        )}
                        {localProfile.uri && (
                            <TouchableOpacity
                                className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                                onPress={() => setProfileImage({})}
                            >
                                <Ionicons
                                    name="close"
                                    size={14}
                                    color="white"
                                />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                    <Text className="text-xs text-gray-500">
                        Click on Photo, Max size of 500KB
                    </Text>
                </View>

                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700 dark:text-slate-400">
                        Fullname
                    </Text>
                    <TextInput
                        value={inputValues.fullname}
                        onChangeText={(text: any) =>
                            handleInputChange("fullname", text)
                        }
                        className="border border-gray-300 dark:border-slate-800 dark:text-slate-200 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="Enter your name"
                    />
                </View>
                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700 dark:text-slate-400">
                        Username
                    </Text>
                    <TextInput
                        value={inputValues.username}
                        onChangeText={(text: any) =>
                            handleInputChange("username", text)
                        }
                        className="border border-gray-300 dark:border-slate-800 dark:text-slate-200 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="Enter username"
                    />
                </View>
            </ScrollView>
            <View className="px-4 pb-6 bg-white dark:bg-black">
                <Button
                    title="Update Profile"
                    onPress={() => updateUser(inputValues).then(() => refetchUser())}
                />
            </View>
        </HomeWrapper>
    )
}