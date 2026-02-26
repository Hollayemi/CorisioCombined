import { Dropdown } from "@/components/dropdown";
import formatCurrency, { formatNumber } from "@/helper/format";
import formatChartLabels from "@/helper/formatLabel";
import { IntervalType, quertParams, useStoreGrowthAnalytics } from '../../../../hooks/useAnalyics';
import { useGetStoreCategoriesGrowthQuery } from "@/redux/business/slices/growthSlice";
import { ArrowUpRight } from "lucide-react-native";
import { Dimensions, Text, TouchableOpacity, useColorScheme, View } from "react-native";

import { LineChart } from "react-native-chart-kit";
const screenWidth = Dimensions.get("window").width;




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
            setSelectedInterval={setSelectedInterval}
            data={each}
            selectedInterval={selectedInterval}
        />
    ));
}

export function CategoryGrowthChart({
    data,
    selectedInterval,
    setSelectedInterval,
}: {
    data: any;
    setSelectedInterval: any;
    selectedInterval: IntervalType;
}) {
    const { _id, data: salesGrowth, sales, count } = data;
    const isDark = useColorScheme() === 'dark';
    const lineColor = !isDark ? "#FDB415" : "#2A347E";

    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `${lineColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`, // line color
        strokeWidth: 2,
        barPercentage: 0.7,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
        propsForDots: {
            r: "6",
            strokeWidth: "3",
            stroke: "#ffffff",
            fill: lineColor, // Inner fill
        },
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
                        <View className="w-8 h-8 bg-blue-100 dark:bg-orange-100 rounded-full justify-center items-center mr-3">
                            <View className="w-4 h-4 bg-blue-700 dark:bg-orange-500 rounded-full" />
                        </View>
                        <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {_id} Sales
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Dropdown
                            options={[
                                { label: "Monthly", value: "monthly" },
                                { label: "Weekly", value: "weekly" },
                                { label: "Daily", value: "daily" },
                            ]}
                            selected={[selectedInterval]} // Wrap in array since component expects array
                            onSelect={(selectedValues) => setSelectedInterval(selectedValues[0])}
                            className="mt-2 py-0 h-9 w-32"
                            textClass="!font-bold"
                            placeholder="Month"
                            multiple={false}
                        />
                        <TouchableOpacity className="p-2">
                            <ArrowUpRight size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>

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

                        {/* Custom center label */}
                        <View className="absolute -top-8 left-2 transform">
                            <Text className="text-3xl font-bold text-gray-700 dark:text-gray-50">
                                {formatCurrency(sales || 0)}
                            </Text>
                            <Text className="text-[12px] text-left text-gray-400 dark:text-blue-100 font-medium">
                                Total Revenue with {formatNumber(count)} items sold
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
