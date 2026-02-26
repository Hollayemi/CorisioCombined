import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function InteractiveChart() {
    const [selectedPoint, setSelectedPoint] = useState<{
        value: number;
        x: number;
        y: number;
    } | null>(null);

    const data = {
        labels: ["", "", "", "", "", ""],
        datasets: [
            {
                data: [15000, 2000, 20000, 9000, 17000, 15237],
                color: () => `rgba(255,255,255,1)`, // optional line color
            },
        ],
    };

    return (
        <View className="w-full bg-orange-400 rounded-xl overflow-hidden">
            <LineChart
                data={data}
                width={screenWidth + 60}
                height={140}
                withDots={false}
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLabels={false}
                withHorizontalLabels={false}
                bezier
                chartConfig={{
                    backgroundColor: "#fb923c",
                    backgroundGradientFrom: "#fb923c",
                    backgroundGradientTo: "#f8ddbe",
                    decimalPlaces: 0,
                    color: () => `rgba(255, 255, 255, 0.8)`,
                    labelColor: () => `rgba(255, 255, 255, 0.8)`,
                }}
                fromZero
                segments={0}
                transparent={true}
                style={{
                    marginLeft: 0,
                    marginRight: 0,
                    marginBottom: -15, // ✅ key part
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingBottom: 0, // ✅ key part
                    borderRadius: 0,
                }}
                onDataPointClick={(data) => {
                    setSelectedPoint({
                        value: data.value,
                        x: data.x,
                        y: data.y,
                    });

                    // Hide after 2 seconds
                    setTimeout(() => setSelectedPoint(null), 2000);
                }}
            />
            {selectedPoint && (
                <View
                    style={{
                        position: "absolute",
                        top: selectedPoint.y + 10,
                        left: selectedPoint.x - 40,
                        backgroundColor: "white",
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        borderRadius: 8,
                        elevation: 4,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 4,
                    }}
                >
                    <Text className="text-black text-xs font-semibold">
                        ${selectedPoint.value.toLocaleString()}
                    </Text>
                </View>
            )}
        </View>
    );
}
