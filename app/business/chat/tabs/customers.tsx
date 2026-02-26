import MessageView from "@/components/chat/messageView";
import NoRecord from "@/components/noRecord";
import useGeolocation from "@/hooks/useGeolocation";
import { useGetUsersToChatQuery } from "@/redux/business/slices/chatSlice";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { RefreshControl, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

export default function MyCustomers() {


    const { coordinates } = useGeolocation();
    const coords = { lat: coordinates.latitude, lng: coordinates.longitude }
    const { data, isLoading: storeListLoading, refetch: refetchCustomers } = useGetUsersToChatQuery({});
    const storeList = (data && data?.data) || {};

    const renderRightActions = (id: any) => (
        <AntDesign
            name="delete"
            size={20}
            color="red"
            className="absolute top-10 right-7"
            onPress={() => { }}
        />
    );

    const stores = storeList.chat;
    const empty = storeList.chat?.length === 0;

    useFocusEffect(
        useCallback(() => {
            refetchCustomers();
        }, [])
    );

    return (
        <View
            className="flex-1 pt-2"
        >


            {empty ? (
                <NoRecord text="No Store Found" />
            ) : (
                <SwipeListView
                    className="px-2"
                    data={stores}
                    refreshControl={
                        <RefreshControl
                            refreshing={storeListLoading}
                            onRefresh={refetchCustomers}

                        />
                    }
                    leftOpenValue={85}
                    keyExtractor={(item: any) => item._id}
                    renderItem={({ item, index }: any) => (
                        <MessageView
                            key={index}
                            {...item.branchDetails}
                            {...item.lastMessage}
                            {...item}
                            rand={Math.floor(Math.random() * 101)}
                        />
                    )}
                    renderHiddenItem={(e: any) => renderRightActions(e.item._id)}
                />
            )}
        </View>

    );
}