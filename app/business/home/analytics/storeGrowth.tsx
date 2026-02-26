import formatCurrency, { formatNumber } from "@/helper/format";
import formatChartLabels from "@/helper/formatLabel";
import {
    IntervalType,
    quertParams,
    useStoreGrowthAnalytics,
} from "@/hooks/useAnalyics";
import { useGetStoreCategoriesGrowthQuery } from "@/redux/business/slices/growthSlice";
import { ArrowUpRight, ChevronDown } from "lucide-react-native";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

import { LineChart } from "react-native-chart-kit";
const screenWidth = Dimensions.get("window").width;

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


export default function CategoriesGrowthChart({
    defaultParams,
}: {
    defaultParams: quertParams;
}) {

    const { data, isLoading, setSelectedInterval, selectedInterval } =
        useStoreGrowthAnalytics({
            queryMutation: useGetStoreCategoriesGrowthQuery,
            defaultParams: defaultParams,
        });

    const { cate = [] } = data?.data || {};

    return cate.map((each: any, i: number) => (
        <CategoryGrowthChart
            key={i}
            data={each}
            selectedInterval={selectedInterval}
        />
    ));
}

function CategoryGrowthChart({
    data,
    selectedInterval,
}: {
    data: any;
    selectedInterval: IntervalType;
}) {
    const { _id, data: salesGrowth, sales, count } = data;

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

    const performanceData = {
        labels: labels,
        datasets: [
            {
                data: getSeries,
                strokeWidth: 3,
                color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
            },
        ],
    };
    return (
        <View>
            <View className="bg-white dark:bg-gray-900 rounded-2xl border p-4 border-gray-200  dark:border-gray-800 mb-5">
                <View className="flex-row justify-between items-center mb-6">
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 bg-orange-100 rounded-full justify-center items-center mr-3">
                            <View className="w-4 h-4 bg-orange-500 rounded-full" />
                        </View>
                        <Text className="text-lg font-semibold text-gray-800">
                            {_id} Sales
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

                {/* Pie Chart */}
                <View className="flex-row">
                    <View className="items-center mb-6">
                        <LineChart
                            data={performanceData}
                            width={screenWidth - 30}
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
                        {/* <PieChart
                            data={categoryChartData}
                            width={screenWidth - 150}
                            height={200}
                            chartConfig={chartConfig}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            center={[10, 10]}
                            hasLegend={false}
                            style={{
                                marginLeft: 0,
                                marginRight: 0,
                                marginBottom: -15, // ✅ key part
                                paddingLeft: 30,
                                paddingRight: 100,
                                paddingBottom: 0, // ✅ key part
                                borderRadius: 0,
                            }}
                        /> */}

                        {/* Custom center label */}
                        <View className="absolute top-20 left-2/3 transform -translate-x-1/2 items-center">
                            <Text className="text-xs text-gray-500 font-medium">
                                Total Sales
                            </Text>
                            <Text className="text-lg font-bold text-gray-800">
                                {formatCurrency(sales)}
                            </Text>
                        </View>
                        <View className="absolute top-20 left-1/2 transform -translate-x-1/2 items-center">
                            <Text className="text-xs text-gray-500 font-medium">
                                Items Sold
                            </Text>
                            <Text className="text-lg font-bold text-gray-800">
                                {formatNumber(count)}
                            </Text>
                        </View>
                    </View>


                </View>
            </View>
        </View>
    );
}
