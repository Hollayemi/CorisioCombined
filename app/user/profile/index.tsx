import React from "react";
import { FlatList, Text, View } from "react-native";
// import HomeHeader from "../../navigations/bottomTabNavigation/HomeHeader";
import HomeWrapper from "@/components/wrapper/user";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useUserData } from "@/hooks/useData";
import { logoutUser } from "@/redux/user/slices/authSlice";
import { useUpdateUserAccountMutation } from "@/redux/user/slices/userSlice2";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import ProfileBox from "./profileBox";
import accountInfo, { accountManagement, accountManagement1, notificatiionPrefernce, productManagement } from "./profileList";
import UserCard from "./userCard";

export default function Profile() {
    const dispatch = useDispatch();
    const [updateUserAccount] = useUpdateUserAccountMutation()
    const logout = () => {
        dispatch(logoutUser());
        router.push("/user/auth/Login");
    };
    const { userInfo, refetchUser } = useUserData() as any;
    const userPref = userInfo.notification_pref;
    const isDark = useColorScheme() === "dark"
    return (
        <HomeWrapper headerTitle="Profile">
            <FlatList
                contentContainerClassName="rounded-2xl overflow-hidden"
                showsVerticalScrollIndicator={false}
                className="flex-1 bg-white dark:bg-slate-950 px-[2%] mt-4"
                ListHeaderComponent={
                    <>
                        <UserCard />
                        <Text className="p-5 font-medium text-[13px] text-neutral-600 dark:text-neutral-300 ">
                            Account Info
                        </Text>
                        <View className="rounded-xl overflow-hidden bg-neutral-100 dark:bg-slate-900">
                            <FlatList
                                contentContainerClassName="p-[5%] bg-neutral-100 dark:bg-slate-900"
                                data={accountInfo}
                                renderItem={({ item, index }) => (
                                    <ProfileBox
                                        {...item}
                                        last={
                                            index === productManagement.length - 1
                                                ? true
                                                : false
                                        }
                                    />
                                )}
                            />
                        </View>
                        <Text className="p-5 font-medium text-[14px] text-neutral-600 dark:text-neutral-300 ">
                            Product Management
                        </Text>
                        <View className="rounded-xl overflow-hidden bg-neutral-100 dark:bg-slate-900">
                            <FlatList
                                data={productManagement}
                                renderItem={({ item, index }) => (
                                    <ProfileBox
                                        {...item}
                                        last={
                                            index === productManagement.length - 1
                                                ? true
                                                : false
                                        }
                                    />
                                )}
                            />
                        </View>
                        <Text className="p-5 font-medium text-[14px] text-neutral-600 dark:text-neutral-300 ">
                            Account Management
                        </Text>
                        <View className="rounded-xl overflow-hidden bg-neutral-100 dark:bg-slate-900">
                            <FlatList
                                contentContainerClassName="p-[5%] bg-neutral-100 dark:bg-slate-900"
                                data={accountManagement}
                                renderItem={({ item, index }) => (
                                    <ProfileBox
                                        {...item}
                                        last={
                                            index === productManagement.length - 1
                                                ? true
                                                : false
                                        }
                                    />
                                )}
                            />
                        </View>
                        <Text className="p-5 font-medium text-[14px] text-neutral-600 dark:text-neutral-300 ">
                            Notification Preferences
                        </Text>
                        <View className="rounded-xl overflow-hidden bg-neutral-100 dark:bg-slate-900">
                            <FlatList
                                contentContainerClassName="p-[5%] bg-neutral-100 dark:bg-slate-900"
                                data={notificatiionPrefernce}
                                renderItem={({ item, index }: any) => (
                                    <ProfileBox
                                        {...item}
                                        last={
                                            index === productManagement.length - 1
                                                ? true
                                                : false
                                        }
                                        isEnabled={userPref[item.key]}
                                        toggleSwitch={() =>
                                            updateUserAccount(
                                                {
                                                    notification_pref: {
                                                        ...userPref,
                                                        [item.key]:
                                                            !userPref[item.key],
                                                    },
                                                }
                                            ).unwrap().then(() => refetchUser())
                                        }
                                    />
                                )}
                            />
                        </View>
                        <Text className="p-5 font-medium text-[14px] text-neutral-600 dark:text-neutral-300 ">
                            Account Management
                        </Text>
                        <View className="rounded-xl overflow-hidden bg-neutral-100 dark:bg-slate-900">
                            <FlatList
                                contentContainerClassName="p-[5%] bg-neutral-100 dark:bg-slate-900"
                                data={accountManagement1}
                                renderItem={({ item, index }) => (
                                    <ProfileBox
                                        {...item}
                                        last={
                                            index === productManagement.length - 1
                                                ? true
                                                : false
                                        }
                                    />
                                )}
                            />
                        </View>
                    </>
                }
                data={[""]}
                renderItem={() => <></>}
                ListFooterComponent={
                    <View className="flex-row justify-between  p-[5%] items-center">
                        <Text
                            className="text-neutral-800 dark:text-neutral-200 font-medium text-[13px]"
                            onPress={() => logout()}
                        >
                            Log Out
                        </Text>
                        <AntDesign
                            name="logout"
                            size={24}
                            color={isDark ? "white" : "black"}
                            onPress={logout}
                        />
                    </View>
                }
            />
        </HomeWrapper>
    );
}