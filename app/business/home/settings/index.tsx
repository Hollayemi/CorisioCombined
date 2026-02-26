import StoreWrapper from "@/components/wrapper/business";
import useImageUploader from "@/hooks/useImageUploader";
import { useUpdateStoreInfoMutation } from "@/redux/business/slices/branchSlice";
import { useGetStoreDetailsQuery } from "@/redux/business/slices/storeSlice";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator, Image, RefreshControl, SafeAreaView, ScrollView, Switch,
    Text, TextInput, TouchableOpacity, View
} from "react-native";
import { hours } from "./hours";

export interface SocialMedia {
    instagram: string;
    facebook: string;
    twitter: string;
    tiktok: string;
}

export interface StoreDataTypes {
    address: string;
    city: string;
    landmark: string;
    about_store: string;
    email: string;
    phone: string;
    businessName: string;
}

interface DaysObj {
    from: string;
    to: string;
    isset: boolean;
}

export interface Days {
    monday: DaysObj;
    tuesday: DaysObj;
    wednesday: DaysObj;
    thursday: DaysObj;
    friday: DaysObj;
    saturday: DaysObj;
    sunday: DaysObj;
}

const StoreAccountPage = () => {
    const { data, isLoading, refetch } = useGetStoreDetailsQuery({});
    const [storeUpdater, { isLoading: updating }] = useUpdateStoreInfoMutation()
    const { business, profile } = data?.data || {};
    const [activeTab, setActiveTab] = useState<"profile" | "settings">(
        "profile"
    );
    const { handleUpload, localFiles, uploading } = useImageUploader();
    // console.log(profile);

    // Store Profile State
    const [preferredCategory, setPreferredCategory] = useState("");
    const [localProfile, setProfileImage] = useState<any>({ uri: "" });

    const [openingHours, setOpeningHours] = useState<Days>(hours);
    const [socialMedia, setSocialMedia] = useState({
        instagram: "",
        facebook: "",
        twitter: "",
        tiktok: "",
    });
    const [inputValues, setValues] = useState({
        address: "",
        city: "",
        landmark: "",
        about_store: "",
        categories: {},
        email: "",
        phone: "",
        businessName: "",
    });
    const [formData, setFormData] = useState({
        pickup: profile?.pickup || false,
        waybill: {
            isset: profile?.waybill?.isset || false,
            waybill_fee_paid_seperately:
                profile?.waybill?.waybill_fee_paid_seperately || false,
            minimum_amount: profile?.waybill?.minimum_amount || "0",
            delivery_hour_diff_opening_hours:
                profile?.waybill?.delivery_hour_diff_opening_hours || false,
        },
        payment_settings: {
            account_name: profile?.payment_settings?.account_name || "",
            account_number: profile?.payment_settings?.account_number || "",
            bank: profile?.payment_settings?.bank || "",
        },
        refund_policies: {
            isset: profile?.refund_policies?.isset || false,
            refund_policy: profile?.refund_policies?.refund_policy || "",
            refund_option: profile?.refund_policies?.refund_option || [],
            repayment_method: profile?.refund_policies?.repayment_method || [],
        },
        allow_preorder: profile?.allow_preorder || false,
        notifications: {
            isset: profile?.notifications?.isset || false,
            low_stock: profile?.notifications?.low_stock || 0,
            isset_low_stock: profile?.notifications?.isset_low_stock || false,
            out_of_stock: profile?.notifications?.out_of_stock || false,
            restock_reminder: profile?.notifications?.restock_reminder || false,
        },
        email_notification: {
            isset: profile?.email_notification?.isset || false,
            order_confirmation:
                profile?.email_notification?.order_confirmation || false,
            shipping_updates:
                profile?.email_notification?.shipping_updates || false,
            account_activity:
                profile?.email_notification?.account_activity || false,
            customer_inquires:
                profile?.email_notification?.customer_inquires || false,
        },
    });
    useEffect(() => {
        setValues({
            address: profile?.address || "",
            city: profile?.city || "",
            landmark: profile?.landmark || "",
            about_store: profile?.about_store || "",
            categories: profile?.categories || {},
            phone: profile?.phone || "",
            email: profile?.email || "",
            businessName: profile?.businessName || "",
        });
        setSocialMedia(profile?.social_media || {});
        setOpeningHours(profile?.opening_hours || {});
    }, [isLoading]);

    // console.log(profile);

    const handleInputChange = (field: keyof StoreDataTypes, value: string) => {
        setValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSocialMediaChange = (
        field: keyof SocialMedia,
        value: string
    ) => {
        setSocialMedia((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const toggleDay = (day: any, value: boolean) => {
        setOpeningHours((prev) => ({
            ...prev,
            [day]: { ...openingHours[day as keyof Days], isset: value },
        }));
    };

    const updateTime = (day: any, type: "from" | "to", value: string) => {
        setOpeningHours((prev) => ({
            ...prev,
            [day]: { ...openingHours[day as keyof Days], [type]: value },
        }));
    };



    const renderStoreProfile = () => (
        <ScrollView className="flex-1 p-4" refreshControl={
            <RefreshControl
                colors={["#3b82f6"]}
                tintColor="#3b82f6"
                refreshing={isLoading}
                onRefresh={refetch}
            />
        }>
            {/* Store Profile Section */}
            <View className="mb-6">
                <Text className="text-xl font-semibold mb-1 text-gray-800">
                    Store Profile
                </Text>
                <Text className="text-md text-gray-600 mb-4">
                    Supply store name and performance
                </Text>

                {/* Store Icon Placeholder */}
                <View className="items-center mb-6 mt-4">
                    <TouchableOpacity
                        onPress={() => handleUpload("profile_image", 1)}
                        className="relative mr-2 mb-2 border border-dashed border-gray-400 rounded-md bg-gray-100"
                    >
                        {uploading ? (
                            <ActivityIndicator />
                        ) : (
                            <Image
                                source={{
                                    uri:
                                        localFiles?.[-1] ||
                                        profile?.profile_image,
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
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Your Store Name
                    </Text>
                    <TextInput
                        value={inputValues.businessName}
                        onChangeText={(text: any) =>
                            handleInputChange("businessName", text)
                        }
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="Enter business name"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Store Address
                    </Text>
                    <Text className="text-sm text-gray-500 mb-2">
                        Provide to your exact address
                    </Text>
                    <TextInput
                        value={inputValues.city}
                        onChangeText={(text: any) =>
                            handleInputChange("city", text)
                        }
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800 "
                        placeholder="City"
                    />
                    <TextInput
                        value={inputValues.address}
                        onChangeText={(text: any) =>
                            handleInputChange("address", text)
                        }
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="Address"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Closest Bus Stop or Landmark
                    </Text>
                    <TextInput
                        value={inputValues.landmark}
                        onChangeText={(text: any) =>
                            handleInputChange("landmark", text)
                        }
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="Enter landmark"
                    />
                </View>
            </View>

            {/* Store Contact Section */}
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-0 text-gray-800">
                    Store Contact
                </Text>
                <Text className="text-sm text-gray-600 mb-4">
                    How can customers reach you
                </Text>

                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Phone Number
                    </Text>
                    <TextInput
                        value={inputValues.phone}
                        onChangeText={(text: any) =>
                            handleInputChange("phone", text)
                        }
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Email Address
                    </Text>
                    <TextInput
                        value={inputValues.email}
                        onChangeText={(text: any) =>
                            handleInputChange("email", text)
                        }
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="Enter email address"
                        keyboardType="email-address"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Preferred Categories
                    </Text>
                    <Text className="text-sm text-gray-500 mb-2">
                        Choose the categories that best describe your store
                    </Text>
                    <TouchableOpacity className="border border-blue-500 rounded-lg px-3 py-3 items-center">
                        <Text className="text-blue-500 font-medium">
                            {preferredCategory || "Select Category"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="mb-6">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        About the store
                    </Text>
                    <Text className="text-sm text-gray-500 mb-2">
                        Write a little about your store
                    </Text>
                    <TextInput
                        value={inputValues.about_store}
                        onChangeText={(text: any) =>
                            handleInputChange("about_store", text)
                        }
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800 h-24"
                        placeholder="Tell us about your store..."
                        multiline
                        textAlignVertical="top"
                    />
                </View>
            </View>

            {/* Social Media Integration */}
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-4 text-gray-800">
                    Social Media Integration
                </Text>
                <Text className="text-sm text-gray-600 mb-4">
                    Get to connect your store with your social media
                </Text>

                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Facebook
                    </Text>
                    <TextInput
                        value={socialMedia?.facebook}
                        onChangeText={(text) =>
                            handleSocialMediaChange("facebook", text)
                        }
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="Facebook profile/page URL"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Instagram
                    </Text>
                    <TextInput
                        value={socialMedia?.instagram}
                        onChangeText={(text) =>
                            handleSocialMediaChange("instagram", text)
                        }
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="Instagram profile URL"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Twitter
                    </Text>
                    <TextInput
                        value={socialMedia?.twitter}
                        onChangeText={(text) =>
                            handleSocialMediaChange("twitter", text)
                        }
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="Twitter profile URL"
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        TikTok
                    </Text>
                    <TextInput
                        value={socialMedia?.tiktok}
                        onChangeText={(text) =>
                            handleSocialMediaChange("tiktok", text)
                        }
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="TikTok profile URL"
                    />
                </View>
            </View>

            {/* Store Gallery */}
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-4 text-gray-800">
                    Store Gallery
                </Text>
                <Text className="text-sm text-gray-600 mb-4">
                    Your first picture will be automatically set as the main
                    photo
                </Text>

                <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-lg py-8 items-center">
                    <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-2">
                        <Text className="text-2xl text-gray-400">📷</Text>
                    </View>
                    <Text className="text-sm text-gray-500">
                        Click and Drop image here or
                    </Text>
                    <Text className="text-sm text-blue-500 font-medium">
                        Choose File
                    </Text>
                </TouchableOpacity>
                <View className="flex-row gap-2 flex-wrap mt-4">
                    {profile?.gallery?.map((gal: any, i: number) => (
                        <View
                            key={i}
                            className="p-1 md:p-1.5 w-20 h-20 border border-gray-200 rounded-md bg-gray-50 relative"
                        >
                            <View className="w-full h-full flex items-center rounded-md  justify-center overflow-hidden ">
                                <Image
                                    className="w-20 h-20 max-h-28 max-w-40 rounded-md"
                                    alt={`image ${i}`}
                                    source={{ uri: gal }}
                                />
                                <View className="h-5 w-5 absolute top-0 right-0 m-0.5 bg-white rounded-full flex justify-center items-center border border-red-500">
                                    <Ionicons name="trash" color={"red"} />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Opening Hours */}
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-4 text-gray-800">
                    Opening Hours
                </Text>

                {Object.entries(openingHours).map(([day, hour], index) => {
                    console.log(hour);
                    return (
                        <View key={day} className="flex-row items-center mb-5">
                            <TouchableOpacity
                                onPress={() => toggleDay(day, !hour.isset)}
                                className="w-7 h-7 border-2 border-gray-300 rounded mr-3 items-center justify-center"
                            >
                                {hour?.isset && (
                                    <View className="w-5 h-5 bg-blue-500 rounded" />
                                )}
                            </TouchableOpacity>

                            <Text className="flex-1 text-lg text-gray-700 font-medium capitalize">
                                {day}
                            </Text>

                            <View className="flex-row items-center">
                                <TextInput
                                    value={hour.from}
                                    onChangeText={(value) =>
                                        updateTime(day, "from", value)
                                    }
                                    className="border border-gray-300 rounded px-2 py-1 w-24 text-center text-md mr-2"
                                    editable={hour?.isset}
                                />
                                <Text className="text-gray-500 text-md mx-1">
                                    -
                                </Text>
                                <TextInput
                                    value={hour.to}
                                    onChangeText={(value) =>
                                        updateTime(day, "to", value)
                                    }
                                    className="border border-gray-300 rounded px-2 py-1 w-24  ml-1 text-center text-md"
                                    editable={hour?.isset}
                                />
                            </View>
                        </View>
                    );
                })}

                <TouchableOpacity
                    onPress={() =>
                        storeUpdater({
                            ...inputValues,
                            social_media: socialMedia,
                            opening_hours: openingHours,
                        })
                    }
                    className="bg-blue-600 rounded-lg py-3 mt-4"
                >
                    <Text className="text-white text-center font-semibold">
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderStoreSettings = () => (
        <ScrollView className="flex-1 p-4">
            {/* Delivery Options */}
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-4 text-gray-800">
                    Delivery Options
                </Text>
                <Text className="text-sm text-gray-600 mb-4">
                    Choose the options of your delivery
                </Text>

                {/* Pickup */}
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-1">
                        <Text className="text-sm font-medium text-gray-700">
                            Pickup
                        </Text>
                        <Text className="text-xs text-gray-500">
                            Client has to come pick up the orders by themselves
                        </Text>
                    </View>
                    <Switch value={formData.pickup || false} />
                </View>

                {/* Waybill */}
                <View className="flex-row items-center justify-between mb-6">
                    <View className="flex-1">
                        <Text className="text-sm font-medium text-gray-700">
                            Waybill
                        </Text>
                        <Text className="text-xs text-gray-500">
                            Waybill Items will be paid by customer separately
                        </Text>
                    </View>
                    <Switch value={formData?.waybill?.isset || false} />
                </View>

                {/* Minimum amount and Delivery fee */}
                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Minimum amount of order fee
                    </Text>
                    <Text className="text-sm text-gray-500 mb-2">
                        Minimum fee that customers need to meet before they can
                        order
                    </Text>
                    <View className="flex-row items-center">
                        <Text className="text-lg font-semibold mr-2">₦</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
                            placeholder="0"
                            value={formData?.waybill?.minimum_amount || "0"}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Delivery fee
                    </Text>
                    <Text className="text-sm text-gray-500 mb-2">
                        Delivery hours are different from opening hours
                    </Text>
                    <View className="flex-row items-center">
                        <Text className="text-lg font-semibold mr-2">₦</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
                            placeholder="0"
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>

            {/* Payment Settings */}
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-4 text-gray-800">
                    Payment settings
                </Text>
                <Text className="text-sm text-gray-600 mb-4">
                    Choose the account which the payment for the purchase will
                    be paid into
                </Text>

                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Bank Name
                    </Text>
                    <TextInput
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="Select bank"
                        value={formData?.payment_settings.bank}
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Account Name
                    </Text>
                    <TextInput
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="Enter account name"
                        value={formData?.payment_settings.account_name}
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Account Number
                    </Text>
                    <TextInput
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="Enter account number"
                        keyboardType="numeric"
                        value={formData?.payment_settings.account_number}
                    />
                </View>
            </View>

            {/* Store Policies */}
            <View className="mb-6">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-lg font-semibold text-gray-800">
                        Store Policies
                    </Text>
                    <Switch value={formData.refund_policies.isset} />
                </View>
                <Text className="text-sm text-gray-600 mb-4">
                    Input some policies for your store
                </Text>

                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Refund and Returns
                    </Text>
                    <TouchableOpacity className="border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between">
                        <Text className="text-gray-600">6 days</Text>
                        <Text className="text-gray-400">▼</Text>
                    </TouchableOpacity>
                </View>

                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Refund and Returns option
                    </Text>
                    <TouchableOpacity className="border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between">
                        <Text className="text-gray-400">Select option</Text>
                        <Text className="text-gray-400">▼</Text>
                    </TouchableOpacity>
                </View>

                <View className="mb-6">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Repayment method
                    </Text>
                    <TextInput
                        className="border border-gray-300 mb-3 rounded-lg px-3 py-3 text-gray-800"
                        placeholder="Enter repayment method"
                    />
                </View>

                {/* Pre-Order option */}
                <View className="mb-4">
                    <Text className="text-md mt-2 font-medium mb-2 text-gray-700">
                        Pre - Order option
                    </Text>
                    <View className="flex-row items-center mb-2">
                        <TouchableOpacity className="w-5 h-5 border-2 border-gray-300 rounded mr-3">
                            <View className="w-3 h-3 bg-blue-500 rounded m-0.5" />
                        </TouchableOpacity>
                        <Text className="text-sm text-gray-700 flex-1">
                            Allow customers to pre-order
                        </Text>
                    </View>
                    <Text className="text-xs text-gray-500 ml-8">
                        This allows customer to simply advance about the product
                        and it will be pre-ordered.
                    </Text>
                </View>
            </View>

            {/* Notification and Alerts */}
            <View className="mb-6">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-lg font-semibold text-gray-800">
                        Notification and Alerts
                    </Text>
                    <Switch value={formData.notifications.isset} />
                </View>
                <Text className="text-sm text-gray-600 mb-4">
                    This includes receiving notification for low stock
                </Text>

                {/* The minimum amount of goods */}
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity className="w-5 h-5 border-2 border-blue-500 rounded mr-3">
                        <View className="w-3 h-3 bg-blue-500 rounded m-0.5" />
                    </TouchableOpacity>
                    <Text className="text-sm text-gray-700 flex-1">
                        The minimum amount of goods
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded px-2 py-1 w-12 text-center text-sm"
                        value="5"
                        keyboardType="numeric"
                    />
                </View>

                {/* Out of stock */}
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity className="w-5 h-5 border-2 border-blue-500 rounded mr-3">
                        <View className="w-3 h-3 bg-blue-500 rounded m-0.5" />
                    </TouchableOpacity>
                    <Text className="text-sm text-gray-700">Out of stock</Text>
                </View>

                {/* Restock Reminder */}
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity className="w-5 h-5 border-2 border-blue-500 rounded mr-3">
                        <View className="w-3 h-3 bg-blue-500 rounded m-0.5" />
                    </TouchableOpacity>
                    <Text className="text-sm text-gray-700">
                        Restock Reminder
                    </Text>
                </View>

                {/* Email Notification */}
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity className="w-5 h-5 border-2 border-blue-500 rounded mr-3">
                        <View className="w-3 h-3 bg-blue-500 rounded m-0.5" />
                    </TouchableOpacity>
                    <Text className="text-sm text-gray-700">
                        Email Notification
                    </Text>
                </View>

                {/* Order Confirmations */}
                <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                        <TouchableOpacity className="w-5 h-5 border-2 border-blue-500 rounded mr-3">
                            <View className="w-3 h-3 bg-blue-500 rounded m-0.5" />
                        </TouchableOpacity>
                        <Text className="text-sm text-gray-700 font-medium">
                            Order Confirmations
                        </Text>
                    </View>
                    <Text className="text-xs text-gray-500 ml-8">
                        When a customer places an order of any product
                    </Text>
                </View>

                {/* Shipping Updates */}
                <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                        <TouchableOpacity className="w-5 h-5 border-2 border-blue-500 rounded mr-3">
                            <View className="w-3 h-3 bg-blue-500 rounded m-0.5" />
                        </TouchableOpacity>
                        <Text className="text-sm text-gray-700 font-medium">
                            Shipping Updates
                        </Text>
                    </View>
                    <Text className="text-xs text-gray-500 ml-8">
                        When there are updates or changes to the order status,
                        such as dispatching and item.
                    </Text>
                </View>

                {/* Product Activity */}
                <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                        <TouchableOpacity className="w-5 h-5 border-2 border-blue-500 rounded mr-3">
                            <View className="w-3 h-3 bg-blue-500 rounded m-0.5" />
                        </TouchableOpacity>
                        <Text className="text-sm text-gray-700 font-medium">
                            Product Activity
                        </Text>
                    </View>
                    <Text className="text-xs text-gray-500 ml-8">
                        When there is account-related activities, such as login
                        attempts or password changes.
                    </Text>
                </View>

                {/* Customer Inquiries */}
                <View className="mb-6">
                    <View className="flex-row items-center mb-2">
                        <TouchableOpacity className="w-5 h-5 border-2 border-blue-500 rounded mr-3">
                            <View className="w-3 h-3 bg-blue-500 rounded m-0.5" />
                        </TouchableOpacity>
                        <Text className="text-sm text-gray-700 font-medium">
                            Customer Inquiries
                        </Text>
                    </View>
                    <Text className="text-xs text-gray-500 ml-8">
                        When there is any inquiry from the customer
                    </Text>
                </View>

                <TouchableOpacity className="bg-blue-600 rounded-lg py-3">
                    <Text className="text-white text-center font-semibold">
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    return (
        <StoreWrapper
            headerTitle="Store Account"
        >
            <SafeAreaView className="flex-1 bg-white">
                {/* Tab Header */}
                <View className="flex-row bg-gray-50 mx-4 mt-4 rounded-lg p-1">
                    <TouchableOpacity
                        onPress={() => setActiveTab("profile")}
                        className={`flex-1 py-3 px-4 rounded-xl ${activeTab === "profile"
                            ? "bg-white border border-gray-200"
                            : ""
                            }`}
                    >
                        <Text
                            className={`text-center font-medium ${activeTab === "profile"
                                ? "text-blue-600"
                                : "text-gray-600"
                                }`}
                        >
                            Store Profile
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setActiveTab("settings")}
                        className={`flex-1 py-3 px-4 rounded-xl ${activeTab === "settings"
                            ? "bg-white border border-gray-200"
                            : ""
                            }`}
                    >
                        <Text
                            className={`text-center font-medium ${activeTab === "settings"
                                ? "text-blue-600"
                                : "text-gray-600"
                                }`}
                        >
                            Store Settings
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                {activeTab === "profile"
                    ? renderStoreProfile()
                    : renderStoreSettings()}
            </SafeAreaView>
        </StoreWrapper>
    );
};

export default StoreAccountPage;
