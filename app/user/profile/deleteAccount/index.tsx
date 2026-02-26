import HomeWrapper from "@/components/wrapper/user";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

export default function DeleteAccount() {
    return (
        <HomeWrapper active="profile" headerTitle="Delete Account">
            <ScrollView className="flex-1 bg-white dark:bg-slate-950 p-[3%] pb-10">
                <View className="flex-row justify-center">
                    <Image
                        source={require("@/assets/images/morphis-delete-files.png")}
                        className="w-[250px] h-[250px]"
                    />
                </View>

                <Text className="text-left font-['Poppins_600SemiBold'] leading-10 my-[5%] !text-gray-950 dark:text-white text-[17px]">
                    Are you sure you want to delete your account permanently?
                </Text>

                <View>
                    <Text className="text-neutral-700 dark:text-neutral-300 text-[15px] leading-10 font-['Poppins_400Regular'] mt-0.5">
                        By proceeding, you understand and agree to the following:
                    </Text>

                    <Text className="text-neutral-700 dark:text-neutral-300 text-[15px] leading-10 font-['Poppins_400Regular'] mt-4 ml-4">
                        1. Data Deletion:
                    </Text>
                    <Text className="text-neutral-700 dark:text-neutral-300 text-[15px] leading-10 font-['Poppins_400Regular'] mt-0.5 ml-8">
                        Your account data, including personal information and order history, will be permanently deleted.
                    </Text>

                    <Text className="text-neutral-700 dark:text-neutral-300 text-[15px] leading-10 font-['Poppins_400Regular'] mt-4 ml-4">
                        2. Access Loss:
                    </Text>
                    <Text className="text-neutral-700 dark:text-neutral-300 text-[15px] leading-10 font-['Poppins_400Regular'] mt-0.5 ml-8">
                        You will lose access to your account and any associated services.
                    </Text>

                    <Text className="text-neutral-700 dark:text-neutral-300 text-[15px] leading-10 font-['Poppins_400Regular'] mt-4 ml-4">
                        3. Recovery Not Possible:
                    </Text>
                    <Text className="text-neutral-700 dark:text-neutral-300 text-[15px] leading-10 font-['Poppins_400Regular'] mt-0.5 ml-8">
                        Account deletion is irreversible. Once confirmed, it cannot be undone.
                    </Text>

                    <Text className="text-neutral-700 dark:text-neutral-300 text-[15px] leading-10 font-['Poppins_400Regular'] mt-4 ml-4">
                        4. Subscriptions and Promotions:
                    </Text>
                    <Text className="text-neutral-700 dark:text-neutral-300 text-[15px] leading-10 font-['Poppins_400Regular'] mt-0.5 ml-8">
                        You will no longer receive updates, newsletters, or promotions from us.
                    </Text>
                </View>

                <View className="flex-row flex-1 items-center justify-between my-8 px-6">
                    <Text className="text-gray-900 !text-center dark:text-white text-[17px] py-[3%] rounded-full flex-[0.4] font-['Poppins_500Medium'] w-full border border-black dark:border-white">
                        Cancel
                    </Text>
                    <Text className="bg-red-500 !text-center text-white text-[17px] py-[3%] rounded-full flex-[0.4] font-['Poppins_500Medium'] w-full ml-5">
                        Confirm Delete
                    </Text>
                </View>
            </ScrollView>
        </HomeWrapper>
    );
}
