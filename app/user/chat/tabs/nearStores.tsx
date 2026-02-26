import MessageView from "@/components/chat/messageView";
import NoRecord from "@/components/noRecord";
import useGeolocation from "@/hooks/useGeolocation";
import { useGetStoresNearbyQuery } from "@/redux/user/slices/storeSlice";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { RefreshControl, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

export default function DiscoverStore(prop: any) {
    const {
        navigation,
        route: { params },
    } = prop;

    const { coordinates } = useGeolocation();
    const coords = { lat: coordinates.latitude, lng: coordinates.longitude }
    const { data: rawNear, isLoading: nearStoreLoading, refetch: refetchNewStore } = useGetStoresNearbyQuery(coords)
    // const { data: s, isLoading: nearStoreLoading } = useGetStoresNearbyQuery(coords)
    const nearStores = rawNear?.data || []

    const renderRightActions = (id: any) => (
        <AntDesign
            name="delete"
            size={20}
            color="red"
            className="absolute top-10 right-7"
            onPress={() => { }}
        />
    );


    const empty = nearStores?.length === 0;

    return (
        <View
            className="flex-1 pt-2"

        >

            {empty ? (
                <NoRecord text="No Store Found" />
            ) : (
                <SwipeListView
                    className="px-2"
                    data={nearStores}
                    refreshControl={
                        <RefreshControl
                            refreshing={nearStoreLoading}
                            onRefresh={refetchNewStore}

                        />
                    }
                    rightOpenValue={-85}
                    keyExtractor={(item: any) => item._id}
                    renderItem={({ item, index }: any) => (
                        <MessageView
                            key={index}
                            {...item}
                            discover={true}
                            rand={Math.floor(Math.random() * 101)}
                        />
                    )}
                    renderHiddenItem={(e: any) => renderRightActions(e.item._id)}
                />
            )}
        </View >

    );
}