// import StoreWrapper from "@/components/wrapper/business";
import formatCurrency from "@/helper/format";
import formatChartLabels from "@/helper/formatLabel";
import { useStoreGrowthAnalytics } from '../../../../hooks/useAnalyics';
import { useGetStoreGrowthQuery } from "@/redux/business/slices/growthSlice";
import { ArrowUpRight, ChevronDown, TrendingUp } from "lucide-react-native";
import React, { useState } from "react";
import {
    Dimensions,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
// import CalendarDateRangeSelector from "../analytics/dateComponent";
// import CategoriesGrowthChart from "./categories";
// import ProductAnsSalesChart from "../earnings/pieChart";

const screenWidth = Dimensions.get("window").width;

const AnalyticsDashboard = () => {
    const [showCalendar, setShowCalendar] = useState(false);
    const { data, selectedInterval, setSelectedInterval, dateRange, setDayFrom, setDayTo, queryParams, refetch } =
        useStoreGrowthAnalytics({
            queryMutation: useGetStoreGrowthQuery,
        });

    console.log("Growth Data: ", data);

    const { salesGrowth, totalSale = "0", lastGrowth = 0 } = data || {};

    let getSeries = data
        ? Object.values(salesGrowth || { jhd: 0 }).map(
            (x: any) => x?.branchSale || x
        )
        : [];

    const getLabels = Object.keys(salesGrowth || { jhd: 0 });
    const labels = formatChartLabels({
        labels: getLabels,
        interval: selectedInterval,
    });
    // Revenue chart data
    const revenueChartData = {
        labels: labels,
        datasets: [
            {
                data: getSeries,
                colors: [
                    () => "#FFB366", // 15th
                    () => "#FFB366", // 16th
                    () => "#FFB366", // 17th
                    () => "#FF6B35", // 18th - highlighted
                    () => "#FFB366", // 19th
                    () => "#FFB366", // 20th
                    () => "#FFB366", // 21st
                ],
            },
        ],
    };

    // Line chart for additional analytics
    const performanceData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                strokeWidth: 3,
                color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.7,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
        propsForLabels: {
            fontSize: 12,
            fontWeight: "500",
            fill: "#6B7280",
        },
        propsForVerticalLabels: {
            fontSize: 10,
            fill: "#9CA3AF",
        },
        propsForHorizontalLabels: {
            fontSize: 10,
            fill: "#9CA3AF",
        },
    };

    const barChartConfig = {
        ...chartConfig,
        fillShadowGradient: "#FF6B35",
        fillShadowGradientOpacity: 1,
    };

    const renderCalendarPicker = () => (
        <Modal
            visible={showCalendar}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowCalendar(false)}
        >
            <View className="flex-1 bg-black/50 justify-start ">
                <View
                    className="bg-white rounded-t-3xl p-6  rounded-b-3xl"
                    style={{ paddingVertical: 50 }}
                >
                    <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
                    <Text className="text-xl font-bold text-gray-900 mb-6 capitalize">
                        Set date interval
                    </Text>
                    {/* <CalendarDateRangeSelector
                        fromDate={dateRange.dateFrom as string}
                        toDate={dateRange.dateTo as string}
                        selectedInterval={selectedInterval}
                        onDateRangeChange={(from, to) => {
                            setDayFrom(from);
                            setDayTo(to);
                        }}
                        onIntervalChange={(interval) =>
                            setSelectedInterval(interval)
                        }
                    /> */}
                    <TouchableOpacity
                        className="bg-blue-800 py-4 rounded-xl mt-3"
                        onPress={() => {
                            // refetch();
                            setShowCalendar(false);
                        }}
                    >
                        <Text className="text-center text-white font-semibold">
                            Confirm
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View
        >
            {/* Additional Stats Cards */}

            <View className="flex-row space-x-4 p-3  dark:bg-gray-900 pb-3 gap-4 bg-gray-50">
                <View className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-50 ">
                            1,247
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                            Total Orders
                        </Text>
                        <Text className="text-xs text-green-600 font-medium mt-1">
                            +8.2%
                        </Text>
                    </View>
                </View>

                <View className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-4  border border-gray-200 dark:border-gray-800">
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                            892
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                            New Customers
                        </Text>
                        <Text className="text-xs text-green-600 font-medium mt-1">
                            +15.3%
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
                <View className="p-3 py-4 ">
                    {/* Total Revenue Section */}
                    <View className="bg-white dark:bg-gray-900 rounded-2xl border p-4 border-gray-200  dark:border-gray-800 mb-5">
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 bg-orange-100 rounded-full justify-center items-center mr-3">
                                    <TrendingUp size={16} color="#FF6B35" />
                                </View>
                                <Text className="text-lg font-semibold text-gray-800">
                                    Total Revenue
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <TouchableOpacity className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg mr-2">
                                    <Text className="text-sm text-gray-600 mr-1">
                                        {selectedInterval}
                                    </Text>
                                    <ChevronDown size={16} color="#6B7280" />
                                </TouchableOpacity>
                                <TouchableOpacity className="p-2">
                                    <ArrowUpRight size={20} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="text-3xl font-bold text-gray-900 mb-1">
                                {formatCurrency(totalSale)}
                            </Text>
                            <Text className="text-sm text-green-600 font-medium">
                                {Number(lastGrowth).toFixed(2)}% Than last month
                            </Text>
                        </View>

                        {/* Revenue Bar Chart */}
                        <View className="items-center mb-4 ">
                            <BarChart
                                data={revenueChartData}
                                width={screenWidth - 50}
                                height={200}
                                chartConfig={barChartConfig}
                                verticalLabelRotation={0}
                                showBarTops={false}
                                fromZero={true}
                                withCustomBarColorFromData={true}
                                flatColor={true}
                                style={{
                                    marginLeft: 0,
                                    marginRight: 0,
                                    marginBottom: -15, // ✅ key part
                                    paddingLeft: 30,
                                    paddingRight: 40,
                                    paddingBottom: 0, // ✅ key part
                                    borderRadius: 0,
                                }}
                                yAxisLabel={""}
                                yAxisSuffix={""}
                            />
                        </View>

                        {/* Amount indicator */}
                        <View className="flex-row justify-center my-3">
                            <View className="bg-orange-500 px-3 py-1 rounded-lg">
                                <Text className="text-white text-sm font-medium">
                                    +$22,502.10
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Category-Based Sales Section */}
                    {/* <CategoriesGrowthChart defaultParams={queryParams} /> */}

                    {/* ProductAnsSalesChart */}
                    {/* <ProductAnsSalesChart defaultParams={queryParams} /> */}

                    {/* Performance Trend */}
                    <View className="bg-white dark:bg-gray-900 rounded-2xl border p-4 border-gray-200  dark:border-gray-800 mb-5">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-semibold text-gray-800">
                                Performance Trend
                            </Text>
                            <TouchableOpacity className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg">
                                <Text className="text-sm text-gray-600 mr-1">
                                    6 Months
                                </Text>
                                <ChevronDown size={16} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <LineChart
                            data={performanceData}
                            width={screenWidth - 0}
                            height={200}
                            chartConfig={chartConfig}
                            bezier
                            withDots={true}
                            withInnerLines={false}
                            withOuterLines={false}
                            withVerticalLines={false}
                            withHorizontalLines={true}
                            style={{
                                marginLeft: 0,
                                marginRight: 0,
                                marginBottom: -5, // ✅ key part
                                paddingLeft: 10,
                                paddingRight: 0,
                                paddingBottom: 0, // ✅ key part
                                borderRadius: 0,
                            }}
                        />
                    </View>

                    {/* Recent Activity */}
                    <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-800 mb-4">
                            Recent Activity
                        </Text>
                        <View className="space-y-4">
                            {[
                                {
                                    item: "Premium Sunglasses",
                                    amount: "$299.99",
                                    time: "2 min ago",
                                    type: "sale",
                                },
                                {
                                    item: "Designer Jeans",
                                    amount: "$159.99",
                                    time: "15 min ago",
                                    type: "sale",
                                },
                                {
                                    item: "Baseball Cap",
                                    amount: "$49.99",
                                    time: "1 hour ago",
                                    type: "sale",
                                },
                                {
                                    item: "Refund Processed",
                                    amount: "-$89.99",
                                    time: "2 hours ago",
                                    type: "refund",
                                },
                            ].map((activity, index) => (
                                <View
                                    key={index}
                                    className="flex-row justify-between items-center py-2"
                                >
                                    <View className="flex-1">
                                        <Text className="text-gray-800 font-medium">
                                            {activity.item}
                                        </Text>
                                        <Text className="text-gray-500 text-sm">
                                            {activity.time}
                                        </Text>
                                    </View>
                                    <Text
                                        className={`font-semibold ${activity.type === "refund"
                                            ? "text-red-600"
                                            : "text-green-600"
                                            }`}
                                    >
                                        {activity.amount}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Bottom padding */}
                    <View className="h-6" />
                </View>
            </ScrollView>
            {renderCalendarPicker()}
        </View>
    );
};

export default AnalyticsDashboard;
