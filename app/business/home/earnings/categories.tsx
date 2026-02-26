import { Dropdown } from "@/components/dropdown";
import { formatNumber } from "@/helper/format";
import formatChartLabels from "@/helper/formatLabel";
import {
    IntervalType,
    quertParams,
    useStoreGrowthAnalytics,
} from "@/hooks/useAnalyics";
import { useGetStoreCategoriesGrowthQuery } from "@/redux/business/slices/growthSlice";
import { formatPrice } from "@/utils/format";
import { Dimensions, useColorScheme, View } from "react-native";

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
        <LineChartComponent
            key={i}
            data={each}
            selectedInterval={selectedInterval}
            setSelectedInterval={setSelectedInterval}
        />
    ));
}

type statComponentProps = {
    stat: string;
    note: string;
    dropdown: any;
}

export function LineChartComponent({
    data,
    selectedInterval,
    hideCurrency = false,
    setSelectedInterval,
    StatComponent,
}: {
    data: any;
    hideCurrency?: boolean;
    setSelectedInterval: any,
    selectedInterval: IntervalType;
    StatComponent?: React.ElementType<statComponentProps>;
}) {
    const { _id, salesGrowth, totalSale, lastGrowth, countItems } = data;

    const isDark = useColorScheme() === 'dark';
    const lineColor = !isDark ? "#FDB415" : "#2A347E";
    const chartConfig = {
        backgroundGradientFrom: "#2C2F9D",
        backgroundGradientTo: "#2C2F9D",
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        decimalPlaces: 2,
        color: (opacity = 1) => !isDark ? `rgba(42, 52, 126, ${opacity})` : `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => !isDark ? `rgba(42, 52, 126, ${opacity})` : `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
        stroke: lineColor,
        propsForDots: {
            r: "6",
            strokeWidth: "4",
            stroke: lineColor,
            fill: lineColor, // Inner fill
        },
        propsForBackgroundLines: {
            // stroke: "transparent",
        },
        propsForLabels: {
            fontSize: 9,
            fontWeight: "bold",
        },
    };

    let getSeries = data
        ? Object.values(salesGrowth || { jhd: 0 }).map(
            (x: any) => x?.sales || 0
        )
        : [];

    const getLabels = Object.keys(salesGrowth || { jhd: 0 });
    const labels = formatChartLabels({
        labels: getLabels,
        interval: selectedInterval,
    });
    console.log({ getSeries, getLabels })
    const performanceData = {
        labels: getLabels,
        datasets: [
            {
                data: getSeries,
                strokeWidth: 4,
                color: (opacity = 1) => `#fff`,
            },
        ],
    };

    return (
        <View className="flex-1">
            <View className="p-4 ">

                {/* Pie Chart */}
                <View className="flex-row">
                    <View className="items-center mt-10">
                        <LineChart
                            data={performanceData}
                            width={screenWidth + 50}
                            height={180}
                            chartConfig={chartConfig}
                            bezier
                            withDots={true}
                            // withInnerLines={false}
                            // withOuterLines={false}
                            withVerticalLines={false}
                            withHorizontalLines={true}
                            style={{
                                marginLeft: -25,
                                marginRight: 0,
                                marginBottom: -5,
                                paddingLeft: 10,
                                paddingRight: 0,
                                paddingBottom: 0,
                                borderRadius: 0,
                            }}
                        />
                        {/* Custom center label */}
                        {StatComponent && <StatComponent
                            stat={formatPrice(totalSale || 0, hideCurrency, true)}
                            note={`${lastGrowth}% vs last month, ${formatNumber(countItems)} items sold`}
                            dropdown={<Dropdown
                                options={[
                                    { label: "Monthly", value: "monthly" },
                                    { label: "Weekly", value: "weekly" },
                                    { label: "Daily", value: "daily" },
                                ]}
                                selected={[selectedInterval]} // Wrap in array since component expects array
                                onSelect={(selectedValues) => setSelectedInterval(selectedValues[0])}
                                className="mt-2 py-0 h-9 w-32 !bg-white"
                                textClass="!font-bold !text-black"
                                placeholder="Month"
                                multiple={false}
                            />}
                        />
                        }

                    </View>
                </View>
            </View>
        </View>
    );
}
