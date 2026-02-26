import GroupAvatar from "@/components/collage"
import { formatDate, formatTime } from "@/utils/format"
import { router } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"

export default function OrderListComponent({ order, isFetching, refetch }: any) {
    return (
        <TouchableOpacity
            key={order._id}
            onPress={() => router.push({ pathname: "/business/home/orders/orderView", params: { data: JSON.stringify({ ...order, isFetching, refetch })} })}
            className="flex-row items-center bg-white dark:bg-gray-800 rounded-lg p-4 mb-3"
            activeOpacity={0.7}
        >
            <GroupAvatar images={order.items.map((e: any) => e.image)} />
            <View className="flex-1 ml-2">
                <Text numberOfLines={1} className="font-semibold w-56 text-black dark:text-white text-[16px] mb-1.5">{`${order.items[0]?.name} ${order.items.length > 2 ? `+${order.items.length - 1} ${order.items.length > 3 && "s"} ` : ''}  `}</Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">{order.orderId}</Text>
            </View>
            <View className="items-end">
                <Text className="text-gray-600 dark:text-gray-300 text-sm mb-1">{formatDate(order.createdAt)}</Text>
                <Text className="text-gray-400 text-sm">{formatTime(order.createdAt)}</Text>
            </View>
        </TouchableOpacity>
    )
}