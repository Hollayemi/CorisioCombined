import HomeWrapper from "@/components/wrapper/user";
import { useUserData } from "@/hooks/useData";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import IntervalContainer from "./component";

export default function Notification() {
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const { notifications } = useUserData() as any;

    // useEffect(() => {
    //     checkNotificationPermissions();
    // }, []);

    // const checkNotificationPermissions = async () => {
    //     const { status } = await Notifications.getPermissionsAsync();
    //     setIsEnabled(status === "granted");
    //     if (status !== "granted") {
    //         router.push("/home/notification");
    //     }
    // };

    return (
        <HomeWrapper active="home" headerTitle="Notification">
            <View className="px-0 bg-white dark:bg-slate-950 flex-1">
                <FlatList
                    data={notifications}
                    renderItem={({ item }: any) => (
                        <IntervalContainer interval={item} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center py-10">
                            <Text className="text-neutral-500 dark:text-neutral-400">
                                No notifications available
                            </Text>
                        </View>
                    }
                />
            </View>
        </HomeWrapper>
    );
}