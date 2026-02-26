import { useGetBusinessNotificationsQuery } from "@/redux/business/slices/campaignSlice";
import { useGetAgentInfoQuery } from "@/redux/business/slices/referralSlice";
import { useGetLoggedInStaffQuery } from "@/redux/business/slices/staffSlice";
import { useGetStoreDetailsQuery } from "@/redux/business/slices/storeSlice";
import { router } from "expo-router";
import React, { createContext, useEffect, useState } from "react";
import { Dimensions, View } from "react-native";

interface StoreDataProviderProps {
    children: React.ReactNode;
}


interface StoreDataContextType {
    staffInfo: any;
    storeInfo: any;
    referral: any;
    selectedAddress: any;
    notifications: any[];
    screenWidth: number;
    showOverlay: (pageName: string | null) => void;
    refetchStaff: any;
    refetchStore: any,
    refetchReferral: any;


    // loading
    referralLoading: boolean;
    storeIsLoading: boolean;
    staffIsLoading: boolean,
}

const defaultProvider: StoreDataContextType = {
    staffInfo: {},
    storeInfo: {},
    referral: {},
    selectedAddress: {},
    showOverlay: () => { },
    refetchStaff: () => { },
    refetchStore: () => { },
    refetchReferral: () => { },
    notifications: [],
    screenWidth: 0,

    // loading
    referralLoading: false,
    storeIsLoading: false,
    staffIsLoading: false,
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


    const {
        data: notif,
        error: notifErr,
        isLoading: notifIsLoading,
    } = useGetBusinessNotificationsQuery({});

    const loadNotif = (!notifErr && !notifIsLoading && notif?.data) || [];

    useEffect(() => {
        setNotifications(loadNotif);
    }, [notif]);

    // Fetch staffInfo
    const {
        data: staffInfo,
        error: staffErr,
        isLoading: staffIsLoading,
        refetch: refetchStaff
    } = useGetLoggedInStaffQuery();


    // Fetch storeInfo
    const {
        data: storeInfo,
        error: storeErr,
        isLoading: storeIsLoading,
        refetch: refetchStore,
    } = useGetStoreDetailsQuery({});

    const {
        data: referralData,
        refetch: refetchReferral,
        isLoading: referralLoading
    } = useGetAgentInfoQuery()
    const referral = referralData?.data || {}

    const staffData = (!staffErr && !staffIsLoading && staffInfo?.data) || {} as any;
    useEffect(() => {
        if (staffData.coordinates && staffData.coordinates[0] === 0) {
            router.push({ pathname: "/business/auth/map", params: { type: 'redirect', from: "/home" } })
        }
    }, [staffData.coordinates]);


    return (
        <View
            style={{ flex: 1, overflow: hideOverflow ? "hidden" : "visible" }}
        >
            <StoreDataContext.Provider
                value={{
                    staffInfo: staffData,
                    storeInfo:
                        (!storeErr && !storeIsLoading && storeInfo?.data) || {},
                    selectedAddress: {},
                    referral,
                    notifications,
                    screenWidth,
                    refetchStaff,
                    refetchStore,
                    refetchReferral,
                    showOverlay,

                    staffIsLoading,
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

