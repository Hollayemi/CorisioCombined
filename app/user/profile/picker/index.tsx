import Button from "@/components/form/Button";
import HomeWrapper from "@/components/wrapper/user";
import { useDeletePickupAgentMutation, useGetPickupAgentsQuery } from "@/redux/user/slices/pickupSlice";
import { AntDesign } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { Text, useColorScheme, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useDispatch } from "react-redux";
import PickerCard from "./card";

type Picker = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    relationship: string;
};

type PickersListProps = {
    pickers: Picker[];
};

export default function PickersList({ navigation }: any) {
    const dispatch = useDispatch();
    const [deletePicker, { isLoading: deleting }] = useDeletePickupAgentMutation()
    const { data: agents, refetch } = useGetPickupAgentsQuery();
    const pickers = agents?.data || [];

    useFocusEffect(
        useCallback(() => {
            refetch(); // runs every time the screen is focused
        }, [])
    );


    const renderRightActions = (id: any, index: any) =>
        index > 0 ? (
            <AntDesign
                name="delete"
                size={20}
                color="red"
                className="mr-2.5 absolute top-10 right-7"
                onPress={() => deletePicker(id).then(() => refetch())}
            />
        ) : (
            <></>
        );

    const renderItem = ({ item, index }: { item: Picker; index: any }) => (
        <View className="">
            <PickerCard item={item} key={index} />
        </View>
    );
    const isDark = useColorScheme() == 'dark'
    return (
        <HomeWrapper headerTitle="Pickup Agent" active="profile">
            <View className="px-2 pt-4 flex-1 bg-white dark:bg-slate-950" style={{ paddingTop: 20 }}>
                <SwipeListView
                    data={pickers}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    rightOpenValue={-75}
                    renderHiddenItem={(e: any) => renderRightActions(e.item._id, e.index)}
                    ListEmptyComponent={<Text>No pickers available.</Text>}
                    ListFooterComponent={
                        // <View
                        //     className="p-4 relative flex-row border-2 border-dashed rounded-md bg-white dark:bg-slate-800 my-1.5 mx-0 border-indigo-900 dark:border-indigo-300 justify-center items-center mt-[10%]"
                        // >
                        //     <AntDesign
                        //         name="plus"
                        //         size={20}
                        //         color={isDark ? '#eee' : "#2A347E"}
                        //         className="mr-2.5 text-indigo-900 dark:text-indigo-300"
                        //     />
                        //     <Text
                        //         className="text-base text-indigo-900 dark:text-indigo-300 font-medium"
                        //         onPress={() => router.push("/user/profile/picker/new")
                        //         }
                        //     >
                        //         Add New Picker
                        //     </Text>
                        // </View>
                        <Button
                            className="!mt-5"
                            onPress={() => router.push("/user/profile/picker/new")}
                            title="Add New Picker"
                        />
                    }
                />
            </View>
        </HomeWrapper>
    );
}