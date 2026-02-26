import Button from "@/components/form/Button";
import HomeWrapper from "@/components/wrapper/user";
import { useUserData } from "@/hooks/useData";
import { useAsDefaultMutation, useDeleteAddressMutation, useGetAddressesQuery } from "@/redux/user/slices/addressSlice";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useDispatch } from "react-redux";
import AddressCard from "./card";

type Picker = {
    _id: string;
    state: string;
    address: string;
    selected: boolean;
    postal_code: string;
    city: string;
};

export default function Addresses({ navigation }: any) {
    const dispatch = useDispatch();
    const [deleteAddress, { isLoading: deleting }] = useDeleteAddressMutation()
    const [selectAsDefault, { isLoading: selecting }] = useAsDefaultMutation()
    const { userInfo, refetchUser } = useUserData() as any;
    const [selected, setSelected] = useState(userInfo?.selectedAddress || {}) as any;
    const { data: addrs, refetch } = useGetAddressesQuery();
    const addresses = addrs?.data || [];

    const renderRightActions = (id: any) => (
        <AntDesign
            name="delete"
            size={20}
            color="red"
            className="mr-2.5 absolute top-10 right-7"
            onPress={() => deleteAddress(id).then(() => refetch())}
        />
    );

    const renderItem = ({ item, index }: { item: Picker; index: any }) => {
        const isDefault = item.selected;
        return (
            <TouchableOpacity
                onPress={() => !item.selected && setSelected(item)}
                key={index}
            >
                <AddressCard
                    item={item}
                    isDefault={isDefault}
                    icon={
                        <AntDesign
                            name="edit"
                            size={15}
                            className="mr-2.5 absolute top-4 right-2.5"
                            onPress={() => deleteAddress(item._id).then(() => refetch())}
                        />
                    }
                />
            </TouchableOpacity>
        );
    };

    return (
        <HomeWrapper headerTitle="Shipping Address" active="profile">
            <View className="pt-3 bg-white dark:bg-slate-950 flex-1">
                <View className="flex-col justify-between h-full">
                    <SwipeListView
                        data={addresses}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                        rightOpenValue={-75}
                        renderHiddenItem={(e: any) => renderRightActions(e.item._id)}
                        ListEmptyComponent={
                            <Text className="text-neutral-600 dark:text-neutral-300 text-center py-4">
                                No shipping address available.
                            </Text>
                        }
                        ListFooterComponent={
                            <TouchableOpacity onPress={() => router.push('/profile/address/newAddress')} className="p-4 relative border-2 border-dashed rounded-md bg-indigo-50 dark:bg-slate-700 my-1.5 mx-4 border-indigo-900 dark:border-indigo-300 justify-center flex-row items-center mt-[10%]">
                                <AntDesign
                                    name="plus"
                                    className="mr-2.5 text-indigo-900 dark:text-indigo-300"
                                    size={20}
                                />
                                <Text
                                    className="text-sm text-indigo-900 dark:text-indigo-300 font-medium"

                                >
                                    Add New Address
                                </Text>
                            </TouchableOpacity>
                        }
                    />
                    <Button
                        title="Set as Default"
                        className="mb-10 mx-2.5"
                        onPress={() => selectAsDefault(selected).then(() => { refetch(); refetchUser() })}
                        disabled={userInfo?.selectedAddress?._id === selected._id || selecting}
                    />
                </View>
            </View>
        </HomeWrapper>
    );
}