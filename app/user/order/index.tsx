import { SearchBox } from "@/components/form/SearchBox";
import Loader from "@/components/loader";
import HomeWrapper from "@/components/wrapper/user";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useGetMyOrdersQuery } from "@/redux/user/slices/orderSlice";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Cancelled from "./cancelled";
import Completed from "./completed";
import Ongoing from "./ongoing";

const Tab = createMaterialTopTabNavigator();

export default function Order() {
    const { data: raw, isLoading } = useGetMyOrdersQuery({});

    const fetchedOrder = raw?.data || {};
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOrder, setFilteredOrder] = useState<any[]>([]);

    // Update filteredOrder when fetchedOrder changes
    useEffect(() => {
        if (fetchedOrder?.result) {
            setFilteredOrder(fetchedOrder.result);
        }
    }, [fetchedOrder?.result]);

    const handleFilter = (input: any) => {
        setSearchQuery(input);
        if (fetchedOrder?.result?.length) {
            const searchFilterFunction = (order: any) =>
                order.store?.toLowerCase().includes(input.toLowerCase()) ||
                order.orderSlug?.toLowerCase().includes(input.toLowerCase());
            // order.items.tracker?.toLowerCase().includes(input.toLowerCase());
            const filteredOrdersArr = fetchedOrder.result.filter(searchFilterFunction);
            setFilteredOrder(filteredOrdersArr);
        } else {
            // If no search input, reset to original data
            if (!input && fetchedOrder?.result) {
                setFilteredOrder(fetchedOrder.result);
            }
        }
    };

    const ongoing = filteredOrder?.filter(
        (x: any) => !["Cancelled", "Completed"].includes(x.currStatus) && x
    );

    const cancelled = filteredOrder?.filter(
        (x: any) => x.currStatus === "Cancelled" && x
    );

    const completed = filteredOrder?.filter(
        (x: any) => x.currStatus === "Completed" && x
    );

    const isDark = useColorScheme() === "dark";

    return (
        <HomeWrapper active="profile" headerTitle="Orders">
            <View className={`px-3 flex-1 mt-2 bg-white dark:bg-slate-950`}>
                <SearchBox
                    placeholder="What are you looking for?"
                    mystyles="h-[50px]"
                    value={searchQuery}
                    onChange={(e: any) => handleFilter(e)}
                    className=" dark:text-white"
                />

                {!isLoading ? (
                    <Tab.Navigator
                        screenOptions={{
                            tabBarIndicatorStyle: {
                                backgroundColor: "transparent",
                                marginBottom: 1,
                                width: "30%",
                                marginLeft: 4,
                                borderBottomWidth: 3,
                                borderBottomColor: isDark ? "#eee" : "#2A347E",
                            },
                            tabBarActiveTintColor: isDark ? "#FDB415" : "#2A347E",
                            tabBarInactiveTintColor: isDark ? "#eee" : "#000",
                            tabBarLabelStyle: {
                                fontSize: 16,
                                fontWeight: "400",
                                textTransform: "capitalize",
                            },
                            tabBarStyle: {
                                elevation: 0,
                                overflow: "hidden",
                                backgroundColor: isDark ? "#020617" : "white",
                            },
                            tabBarIndicatorContainerStyle: {
                                backgroundColor: isDark ? "#020617" : "white",
                            },
                        }}
                        style={{ flex: 1, backgroundColor: "white" }}
                        // Add key to force re-render when data changes
                        key={`navigator-${filteredOrder.length}`}
                    >
                        <Tab.Screen
                            name="Ongoing"
                            component={Ongoing}
                            initialParams={{ data: ongoing }}
                            options={{
                                tabBarLabel: `Ongoing (${ongoing.length})`,
                            }}
                        />
                        <Tab.Screen
                            name="Completed"
                            component={Completed}
                            initialParams={{ data: completed }}
                            options={{
                                tabBarLabel: `Completed (${completed.length})`,
                            }}
                        />
                        <Tab.Screen
                            name="Cancelled"
                            component={Cancelled}
                            initialParams={{ data: cancelled }}
                            options={{
                                tabBarLabel: `Cancelled (${cancelled.length})`,
                            }}
                        />
                    </Tab.Navigator>
                ) : (
                    <Loader />
                )}
            </View>
        </HomeWrapper>
    );
}