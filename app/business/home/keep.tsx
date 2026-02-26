import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Mock data - replace with API calls
const metrics = [
    { icon: "🛍️", title: "Today's Orders", value: "12", trend: "+2%" },
    { icon: "💵", title: "Total Sales", value: "$1,240", trend: "+15%" },
    { icon: "👥", title: "Visitors", value: "84", trend: "-5%" },
    { icon: "⭐", title: "Rating", value: "4.8", trend: "↑ 0.2" },
];

const recentOrders = [
    {
        id: "1",
        customer: "Sarah K.",
        products: "3 items",
        time: "10 min ago",
        status: "processing",
    },
    {
        id: "2",
        customer: "Mike T.",
        products: "1 item",
        time: "25 min ago",
        status: "pending",
    },
    {
        id: "3",
        customer: "Lisa M.",
        products: "5 items",
        time: "1 hr ago",
        status: "delivered",
    },
];

export default function HomeScreen() {
    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-[#2C337C] p-4 pt-12 pb-6">
                <Text className="text-2xl text-white">Store Dashboard</Text>
                <Text className="text-[#FCB415] mt-1">
                    Today, {new Date().toLocaleDateString()}
                </Text>
            </View>

            {/* 1. Summary Cards */}
            <FlatList
                horizontal
                data={metrics}
                contentContainerStyle={styles.metricsContainer}
                renderItem={({ item }) => (
                    <View className="bg-white rounded-xl p-4 w-40 mr-3 shadow-sm">
                        <Text className="text-2xl mb-1">{item.icon}</Text>
                        <Text className="text-gray-500 text-sm">
                            {item.title}
                        </Text>
                        <Text className="text-xl font-bold mt-1 text-[#2C337C]">
                            {item.value}
                        </Text>
                        <Text
                            className={`text-xs mt-1 ${
                                item.trend.startsWith("+") ||
                                item.trend.includes("↑")
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            {item.trend}
                        </Text>
                    </View>
                )}
            />

            {/* 2. Recent Orders */}
            <View className="px-4 mt-6">
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-xl text-[#2C337C]">
                        Recent Orders
                    </Text>
                    <Link href="/orders" asChild>
                        <Pressable>
                            <Text className="text-[#f8ddbe]">View All</Text>
                        </Pressable>
                    </Link>
                </View>

                <FlatList
                    data={recentOrders}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                console.log("Order details:", item.id)
                            }
                            className="bg-white rounded-lg p-4 mb-3 shadow-xs"
                        >
                            <View className="flex-row justify-between">
                                <Text className="font-bold">
                                    {item.customer}
                                </Text>
                                <Text className="text-gray-500">
                                    {item.time}
                                </Text>
                            </View>
                            <Text className="text-gray-600 mt-1">
                                {item.products}
                            </Text>
                            <View className="flex-row items-center mt-2">
                                <View
                                    className={`w-2 h-2 rounded-full mr-2 ${
                                        item.status === "delivered"
                                            ? "bg-green-500"
                                            : item.status === "processing"
                                            ? "bg-[#FCB415]"
                                            : "bg-gray-400"
                                    }`}
                                />
                                <Text className="text-gray-500 capitalize">
                                    {item.status}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* 3. Quick Actions */}
            <View className="px-4 mt-6 mb-8">
                <Text className="text-xl text-[#2C337C] mb-3">
                    Manage Products
                </Text>

                <View className="flex-row justify-between">
                    <Link href="/products" asChild>
                        <Pressable className="bg-white p-4 rounded-lg flex-1 mr-2 items-center shadow-xs">
                            <Ionicons name="list" size={24} color="#2C337C" />
                            <Text className="mt-2 text-[#2C337C]">
                                View All
                            </Text>
                        </Pressable>
                    </Link>

                    <Link href="/products/new" asChild>
                        <Pressable className="bg-white p-4 rounded-lg flex-1 ml-2 items-center shadow-xs">
                            <Ionicons
                                name="add-circle"
                                size={24}
                                color="#FCB415"
                            />
                            <Text className="mt-2 text-[#2C337C]">Add New</Text>
                        </Pressable>
                    </Link>
                </View>

                {/* Low Stock Alert (Example) */}
                <Pressable
                    onPress={() => console.log("View low stock")}
                    className="bg-red-50 border border-red-100 p-3 rounded-lg mt-4 flex-row items-center"
                >
                    <Ionicons name="warning" size={20} color="#DC2626" />
                    <Text className="text-red-800 ml-2">
                        5 items low in stock
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    metricsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
});
