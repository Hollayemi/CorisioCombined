"use client";
import { useGetMyCartQuery } from "@/redux/user/slices/cartSlice";
import { useGetFollowingStoresQuery } from "@/redux/user/slices/followSlice";
import { useGetSavedItemsQuery } from "@/redux/user/slices/saveItemSlice";
import { useGetUserAccountQuery, useGetUserNotificationsQuery } from "@/redux/user/slices/userSlice2";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

export interface UserDataContextType {
    cartedProds: any;
    following: any[];
    savedProds: Record<string, any>;
    cartData: Record<string, any>;
    userInfo: Record<string, any>;
    selectedAddress: Record<string, any>;
    notifications: any[];
    loading: boolean;

    // loading
    cartIsLoading?: boolean;

    // Methods
    showAlert: any;
    setLoading: (loading: boolean) => void;
    refetchUser: () => void;
    refetchCart: () => void;
    refetchSavedItems: () => void
}

const defaultProvider: UserDataContextType = {
    cartedProds: [],
    savedProds: [],
    following: [],
    cartData: {},
    userInfo: {},
    selectedAddress: {},
    notifications: [],
    loading: false,
    setLoading: () => { },
    showAlert: () => { },
    refetchUser: () => { },
    refetchCart: () => { },
    refetchSavedItems: () => { },
};

const DataContext = createContext(defaultProvider);

const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [notifications, setNotification] = useState<any>([]);

    const {
        data: userInfo,
        error: userErr,
        refetch: refetchUser,
        isLoading: userIsLoading,
    } = useGetUserAccountQuery();

    const {
        data: notif,
        error: notifErr,
        isLoading: notifIsLoading,
    } = useGetUserNotificationsQuery();

    const {
        data: cartData,
        error: cartErr,
        refetch: refetchCart,
        isLoading: cartIsLoading,
    } = useGetMyCartQuery();

    const {
        data: savedData,
        error: savedErr,
        isLoading: savedIsLoading,
        refetch: refetchSavedItems,
    } = useGetSavedItemsQuery();

    const {
        data: following,
        error: folErr,
        isLoading: folIsLoading,
    } = useGetFollowingStoresQuery();

    const loadNotif = (!notifErr && !notifIsLoading && notif?.data) || [];

    useEffect(() => {
        setNotification(loadNotif);
    }, [notif]);



    interface alertProps {
        title: string;
        message: string;
        buttons?: [];
    }

    const showAlert = ({ title, message, buttons = [] }: alertProps) => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: "Cancel", // First Button
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                ...buttons,
            ],
            { cancelable: false }
        );
    };
    return (
        <DataContext.Provider
            value={{
                // Existing data
                cartedProds: (!cartErr && !cartIsLoading && cartData?.data?.cartedProds) || [],
                savedProds: (!savedErr && !savedIsLoading && savedData?.data?.map(e => e?.productId)) || [],
                following: (!folErr && !folIsLoading && following?.data) || [],
                cartData: (!cartErr && !cartIsLoading && cartData?.data) || {},
                userInfo: (!userErr && !userIsLoading && userInfo?.user) || {},
                notifications,
                selectedAddress: {},
                loading,

                // loading
                cartIsLoading,

                // Methods
                showAlert,
                setLoading,
                refetchUser,
                refetchCart,
                refetchSavedItems
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export { DataContext, UserDataProvider };

