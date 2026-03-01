import { useGetMyReferralCodeQuery } from "@/redux/business/slices/referralSlice";
import { useGetMyStoreQuery } from "@/redux/business/slices/storeInfoSlice";
import { router } from "expo-router";
import React, { createContext, useEffect, useState } from "react";
import { Dimensions, View } from "react-native";

interface StoreDataProviderProps {
    children: React.ReactNode;
}


interface StoreDataContextType {
    storeInfo: any;
    referral: any;
    selectedAddress: any;
    notifications: any[];
    screenWidth: number;
    showOverlay: (pageName: string | null) => void;
    refetchStore: any,
    refetchReferral: any;


    // loading
    referralLoading: boolean;
    storeIsLoading: boolean;
}

const defaultProvider: StoreDataContextType = {
    storeInfo: {},
    referral: {},
    selectedAddress: {},
    showOverlay: () => { },
    refetchStore: () => { },
    refetchReferral: () => { },
    notifications: [],
    screenWidth: 0,

    // loading
    referralLoading: false,
    storeIsLoading: false,
};

const StoreDataContext = createContext<StoreDataContextType>(defaultProvider);

const StoreDataProvider: React.FC<StoreDataProviderProps> = ({ children }) => {
    const [hideOverflow, setOverflow] = useState(true);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [overLay, setOpenOverlay] = useState<string | null>(null);

    const [screenWidth, setWidth] = useState(Dimensions.get("window").width);

    useEffect(() => {
        const subscription = Dimensions.addEventListener(
            "change",
            ({ window }) => {
                setWidth(window.width);
            }
        );

        return () => subscription?.remove();
    }, []);

    const showOverlay = (pageName: string | null = null) => {
        if (overLay) {
            setOverflow(false);
            setOpenOverlay(null);
        } else {
            setOverflow(true);
            setOpenOverlay(pageName);
        }
    };


    // const {
    //     data: notif,
    //     error: notifErr,
    //     isLoading: notifIsLoading,
    // } = useGetBusinessNotificationsQuery({});

    const loadNotif = {} //(!notifErr && !notifIsLoading && notif?.data) || [];

    // useEffect(() => {
    //     setNotifications(loadNotif);
    // }, [notif]);

    // Fetch storeInfo
    const {
        data: storeInfo,
        error: storeErr,
        isLoading: storeIsLoading,
        refetch: refetchStore,
    } = useGetMyStoreQuery();

    const {
        data: referralData,
        refetch: refetchReferral,
        isLoading: referralLoading
    } = useGetMyReferralCodeQuery()

    const referral = referralData?.data || {}

    // useEffect(() => {
    //     if (staffData.coordinates && staffData.coordinates[0] === 0) {
    //         router.push({ pathname: "/business/auth/map", params: { type: 'redirect', from: "/home" } })
    //     }
    // }, [staffData.coordinates]);


    return (
        <View
            style={{ flex: 1, overflow: hideOverflow ? "hidden" : "visible" }}
        >
            <StoreDataContext.Provider
                value={{
                    storeInfo:
                        (!storeErr && !storeIsLoading && storeInfo?.data) || {},
                    selectedAddress: {},
                    referral,
                    notifications,
                    screenWidth,
                    refetchStore,
                    refetchReferral,
                    showOverlay,

                    referralLoading,
                    storeIsLoading,
                }}
            >
                {children}
            </StoreDataContext.Provider>
        </View>
    );
};


export { StoreDataContext, StoreDataProvider };

