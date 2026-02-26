import { TrendingDown, TrendingUp } from "lucide-react-native"
import { Text, View } from "react-native"

export const OrderStats = ({ currentKeys, currentStats }: any) => {

    return (
        <View className="bg-gray-50 dark:bg-gray-900 px-2  py-4">
            <View className="flex-row py-5 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                {currentKeys.map((res: any, i: number) => {
                    const curr = currentStats[res as any]
                    return (
                        <View key={i} className="flex-1 items-center">
                            <View className='flex-row items-center'>
                                <Text className="text-gray-500 dark:text-gray-400 capitalize text-sm mb-1">{res.split("_").join(" ")}</Text>
                                <Text className={`${parseInt(curr.growth) > 0 ? "text-green-500 dark:text-green-400" : "text-red-600 dark:text-red-400"} ml-2 capitalize text-sm mb-1  `}>
                                    {parseFloat(curr.growth).toFixed(1)}
                                    {parseInt(curr.growth) > 0 ? <TrendingUp size={12} style={{ marginTop: 10 }} className="!mb-2" color="green" /> : <TrendingDown size={12} style={{ marginTop: 10 }} className="!mb-2" color="red" />}
                                </Text>
                            </View>
                            <Text className="text-2xl font-bold text-gray-500 dark:text-white">{curr?.stat}</Text>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}