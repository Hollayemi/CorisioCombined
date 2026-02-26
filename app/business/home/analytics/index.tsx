import StoreWrapper from "@/components/wrapper/business";
import { ArrowUpRight, ChevronDown, TrendingUp } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const AnalyticsDashboard = () => {
    
    const [selectedPeriod, setSelectedPeriod] = useState("This Month");
    const [categoryPeriod, setCategoryPeriod] = useState("7 Days");

    // Sample data for the revenue chart
    const revenueData = [
        { day: "15th", amount: 15000 },
        { day: "16th", amount: 18000 },
        { day: "17th", amount: 22000 },
        { day: "18th", amount: 19500 },
        { day: "19th", amount: 16000 },
        { day: "20th", amount: 17500 },
        { day: "21st", amount: 20000 },
    ];

    const maxAmount = Math.max(...revenueData.map((item) => item.amount));
    const highlightedDay = "18th";

    // Category data
    const categoryData = [
        { name: "Upper", percentage: 43, color: "#FF6B35" },
        { name: "Pant", percentage: 27, color: "#F7931E" },
        { name: "Glasses", percentage: 10, color: "#FFB366" },
        { name: "Hat", percentage: 20, color: "#FDD8B5" },
    ];

    const totalProfit = 80981;

    // Create SVG-like donut chart using View components
    const DonutChart = () => {
        const radius = 60;
        const strokeWidth = 20;
        const normalizedRadius = radius - strokeWidth * 2;
        const circumference = normalizedRadius * 2 * Math.PI;

        let cumulativePercentage = 0;

        return (
            <View className="relative w-32 h-32 justify-center items-center">
                {/* Background circle */}
                <View
                    className="absolute rounded-full border-8 border-gray-100"
                    style={{ width: radius * 2, height: radius * 2 }}
                />

                {/* Colored segments */}
                {categoryData.map((item, index) => {
                    const segmentPercentage = item.percentage;
                    const rotation = (cumulativePercentage / 100) * 360;
                    cumulativePercentage += segmentPercentage;

                    return (
                        <View
                            key={index}
                            className="absolute rounded-full"
                            style={{
                                width: radius * 2,
                                height: radius * 2,
                                borderWidth: strokeWidth,
                                borderColor: item.color,
                                borderTopColor: "transparent",
                                borderRightColor:
                                    segmentPercentage > 25
                                        ? item.color
                                        : "transparent",
                                borderBottomColor:
                                    segmentPercentage > 50
                                        ? item.color
                                        : "transparent",
                                borderLeftColor:
                                    segmentPercentage > 75
                                        ? item.color
                                        : "transparent",
                                transform: [{ rotate: `${rotation}deg` }],
                            }}
                        />
                    );
                })}

                {/* Center content */}
                <View className="absolute justify-center items-center bg-white rounded-full w-20 h-20">
                    <Text className="text-xs text-gray-500 font-medium">
                        Total Profit
                    </Text>
                    <Text className="text-lg font-bold text-gray-800">
                        ${totalProfit.toLocaleString()}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <StoreWrapper>
            <ScrollView className="flex-1 bg-gray-50">
                <View className="p-4 space-y-6">
                    {/* Total Revenue Section */}
                    <View className="bg-white rounded-2xl p-6 shadow-sm">
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
                                        {selectedPeriod}
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
                                $279,451.78
                            </Text>
                            <Text className="text-sm text-green-600 font-medium">
                                +12% Than last month
                            </Text>
                        </View>

                        {/* Revenue Chart */}
                        <View className="mb-4">
                            <View className="flex-row justify-between items-end h-32 px-2">
                                {revenueData.map((item, index) => (
                                    <View
                                        key={index}
                                        className="items-center flex-1 mx-1"
                                    >
                                        <View
                                            className="w-full justify-end"
                                            style={{ height: 100 }}
                                        >
                                            <View
                                                className={`w-full rounded-t-md ${
                                                    item.day === highlightedDay
                                                        ? "bg-orange-500"
                                                        : "bg-orange-200"
                                                }`}
                                                style={{
                                                    height: `${
                                                        (item.amount /
                                                            maxAmount) *
                                                        100
                                                    }%`,
                                                    minHeight: 20,
                                                }}
                                            />
                                        </View>
                                        <Text className="text-xs text-gray-500 mt-2">
                                            {item.day}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            {/* Amount indicator */}
                            <View className="mt-2 flex-row justify-center">
                                <View className="bg-orange-500 px-3 py-1 rounded-lg">
                                    <Text className="text-white text-sm font-medium">
                                        +$22,502.10
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Y-axis labels */}
                        <View className="absolute left-2 top-32 h-24 justify-between">
                            <Text className="text-xs text-gray-400">20k</Text>
                            <Text className="text-xs text-gray-400">15k</Text>
                            <Text className="text-xs text-gray-400">10k</Text>
                            <Text className="text-xs text-gray-400">5k</Text>
                            <Text className="text-xs text-gray-400">0</Text>
                        </View>
                    </View>

                    {/* Category-Based Sales Section */}
                    <View className="bg-white rounded-2xl p-6 shadow-sm">
                        <View className="flex-row justify-between items-center mb-6">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 bg-orange-100 rounded-full justify-center items-center mr-3">
                                    <View className="w-4 h-4 bg-orange-500 rounded-full" />
                                </View>
                                <Text className="text-lg font-semibold text-gray-800">
                                    Category-Based Sales
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <TouchableOpacity className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg mr-2">
                                    <Text className="text-sm text-gray-600 mr-1">
                                        {categoryPeriod}
                                    </Text>
                                    <ChevronDown size={16} color="#6B7280" />
                                </TouchableOpacity>
                                <TouchableOpacity className="p-2">
                                    <ArrowUpRight size={20} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="items-center mb-8">
                            <DonutChart />
                        </View>

                        {/* Category Legend */}
                        <View className="space-y-4">
                            {categoryData.map((item, index) => (
                                <View
                                    key={index}
                                    className="flex-row justify-between items-center"
                                >
                                    <View className="flex-row items-center">
                                        <View
                                            className="w-3 h-3 rounded-full mr-3"
                                            style={{
                                                backgroundColor: item.color,
                                            }}
                                        />
                                        <Text className="text-gray-700 font-medium">
                                            {item.name}
                                        </Text>
                                    </View>
                                    <Text className="text-gray-900 font-semibold">
                                        {item.percentage}%
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Additional Stats Cards */}
                    <View className="flex-row space-x-4">
                        <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-gray-900">
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

                        <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-gray-900">
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

                    {/* Recent Activity */}
                    <View className="bg-white rounded-2xl p-6 shadow-sm">
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
                                        className={`font-semibold ${
                                            activity.type === "refund"
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
        </StoreWrapper>
    );
};

export default AnalyticsDashboard;
