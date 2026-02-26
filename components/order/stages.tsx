import React from "react";
import { Text, View } from "react-native";
import { formatDateToMonthShort } from "../../utils/format";
import { nextSteps, orderStatusMessages } from "./data";

interface OrderStagesProps {
    at: number;
    orderSlug?: string;
    delivery: string;
}

interface StageProps {
    stage: string;
    isLast?: boolean;
    date?: string;
    details?: boolean;
}

export const OrderStages = ({ statusHistory, details, currStatus }: any) => {
    const Stage: React.FC<StageProps> = ({ stage, isLast, date, details }) => {
        const pickIcon: any = {
            1: { icon: "currency-usd", name: "Paid" },
            2: { icon: "box", name: "Packaged" },
            3: { icon: "truck-delivery", name: "Pickable" },
            4: { icon: "package-variant", name: "Received" },
            5: { icon: "star", name: "Review" },
        };

        const statusStyle = !details
            ? isLast
                ? "bg-yellow-500 dark:bg-yellow-600" // current
                : "bg-indigo-900 dark:bg-indigo-800" // completed
            : "bg-neutral-200 dark:bg-neutral-700"; // upcoming

        const { title, note } =
            orderStatusMessages[stage.replaceAll(" ", "_").toLowerCase()] || {};

        return (
            <View className="flex-row px-[5%]">
                <View className="flex-col items-center z-50">
                    <View className="flex-col items-center z-50 -mt-4">
                        <View className="items-center justify-center relative">
                            <View className={`w-5 h-5 rounded-full items-center justify-center ${statusStyle}`}>
                                <View className="w-2.5 h-2.5 rounded-full bg-white dark:bg-slate-200"></View>
                            </View>
                        </View>
                    </View>
                   {!isLast && <View className={`w-2 h-24 ${statusStyle}`}/>}
                </View>

                <View className={`px-3 pl-5 ml-[-11px] border-l !border-red-500 ${isLast ? 'border-l-0' : 'border-l-neutral-200 dark:border-l-neutral-700'} border-dashed`}>
                    <View className="flex-row items-end">
                        <Text className="text-xl font-bold text-black dark:text-white">{title}</Text>
                        <Text className="font-normal leading-6 ml-2 text-neutral-600 dark:text-neutral-400">
                            {date
                                ? formatDateToMonthShort(date, true, {
                                    month: "long",
                                    year: "numeric",
                                })
                                : "- - - "}
                        </Text>
                    </View>
                    <Text className="font-normal leading-6 mt-1.5 text-neutral-500 dark:text-neutral-400 pb-8">
                        {!details ? note : "- - -"}
                    </Text>
                </View>
            </View>
        );
    };

    const curr = currStatus?.replaceAll(" ", "_").toLowerCase();
    return (
        <View className="mt-2.5">
            {statusHistory.map((each: any, i: any) => (
                <Stage
                    stage={each.status}
                    date={each.date || each.data}
                    isLast={details ? false : i === statusHistory.length - 1}
                    key={i}
                />
            ))}
            {details &&
                nextSteps[curr]?.map((each: any, i: any) => (
                    <Stage
                        stage={each}
                        key={i}
                        isLast={i === nextSteps[curr]?.length - 1}
                        details
                    />
                ))}
        </View>
    );
};