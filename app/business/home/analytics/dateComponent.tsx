import { ChevronDown, Rotate3D, RotateCcw } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

type IntervalType = "daily" | "weekly" | "monthly";

interface CalendarDateRangeSelectorProps {
    fromDate?: string; // 'YYYY-MM-DD' format
    toDate?: string; // 'YYYY-MM-DD' format
    selectedInterval?: IntervalType;
    onDateRangeChange?: (fromDate: string, toDate: string) => void;
    onIntervalChange?: (interval: IntervalType) => void;
    style?: string;
}

const CalendarDateRangeSelector: React.FC<CalendarDateRangeSelectorProps> = ({
    fromDate = "2025-06-03",
    toDate = "2025-06-18",
    selectedInterval = "monthly",
    onDateRangeChange,
    onIntervalChange,
    style = "",
}) => {
    const [activeFromDate, setActiveFromDate] = useState<string>(fromDate);
    const [activeToDate, setActiveToDate] = useState<string>(toDate);
    const [activeInterval, setActiveInterval] =
        useState<IntervalType>(selectedInterval);
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [tempFromDate, setTempFromDate] = useState<string>(fromDate);
    const [tempToDate, setTempToDate] = useState<string>(toDate);
    const [isSelectingRange, setIsSelectingRange] = useState<boolean>(false);

    const intervals: { key: IntervalType; label: string }[] = [
        { key: "daily", label: "Daily" },
        { key: "weekly", label: "Weekly" },
        { key: "monthly", label: "Monthly" },
    ];

    const formatDateRange = (from: string, to: string): string => {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        const options: Intl.DateTimeFormatOptions = {
            month: "short",
            day: "numeric",
            year: "numeric",
        };

        const fromStr = fromDate.toLocaleDateString("en-US", options);
        const toStr = toDate.toLocaleDateString("en-US", options);

        return `${fromStr} - ${toStr}`;
    };

    const handleIntervalPress = (interval: IntervalType) => {
        setActiveInterval(interval);
        onIntervalChange?.(interval);
    };

    const handleDayPress = (day: DateData) => {
        if (!isSelectingRange) {
            // Start selecting range
            setTempFromDate(day.dateString);
            setTempToDate(day.dateString);
            setIsSelectingRange(true);
        } else {
            // Complete range selection
            const selectedDate = new Date(day.dateString);
            const fromDate = new Date(tempFromDate);

            if (selectedDate >= fromDate) {
                setTempToDate(day.dateString);
            } else {
                // If selected date is before start, swap them
                setTempFromDate(day.dateString);
                setTempToDate(tempFromDate);
            }
            setIsSelectingRange(false);
        }
    };

    const getMarkedDates = () => {
        const marked: any = {};
        const startDate = new Date(tempFromDate);
        const endDate = new Date(tempToDate);

        // Mark all dates in the range
        const current = new Date(startDate);
        while (current <= endDate) {
            const dateString = current.toISOString().split("T")[0];

            if (dateString === tempFromDate && dateString === tempToDate) {
                // Single day selection
                marked[dateString] = {
                    startingDay: true,
                    endingDay: true,
                    color: "#3B82F6",
                    textColor: "white",
                };
            } else if (dateString === tempFromDate) {
                // Start of range
                marked[dateString] = {
                    startingDay: true,
                    color: "#3B82F6",
                    textColor: "white",
                };
            } else if (dateString === tempToDate) {
                // End of range
                marked[dateString] = {
                    endingDay: true,
                    color: "#3B82F6",
                    textColor: "white",
                };
            } else {
                // Middle of range
                marked[dateString] = {
                    color: "#DBEAFE",
                    textColor: "#1E40AF",
                };
            }

            current.setDate(current.getDate() + 1);
        }

        return marked;
    };

    const handleConfirmSelection = () => {
        setActiveFromDate(tempFromDate);
        setActiveToDate(tempToDate);
        onDateRangeChange?.(tempFromDate, tempToDate);
        setShowCalendar(false);
        setIsSelectingRange(false);
    };

    const handleCancelSelection = () => {
        setTempFromDate(activeFromDate);
        setTempToDate(activeToDate);
        setShowCalendar(false);
        setIsSelectingRange(false);
    };

    return (
        <View className={`bg-white rounded-2xl p-4  ${style}`}>
            {/* Date Range Display */}
            <View className="flex-row items-center justify-between">
                <TouchableOpacity
                    onPress={() => setShowCalendar(true)}
                    className="flex-1 bg-gray-50 rounded-xl p-4 mr-3 border border-gray-200 flex-row items-center justify-between"
                >
                    <Text className="text-gray-800 font-semibold text-base">
                        {formatDateRange(activeFromDate, activeToDate)}
                    </Text>
                    <ChevronDown color="gray" size={16} />
                </TouchableOpacity>

                {/* Interval Selector */}
                <TouchableOpacity
                    onPress={() => {
                        const currentIndex = intervals.findIndex(
                            (i) => i.key === activeInterval
                        );
                        const nextInterval =
                            intervals[(currentIndex + 1) % intervals.length];
                        handleIntervalPress(nextInterval.key);
                    }}
                    className="px-4 py-4 bg-blue-800 rounded-xl flex-row items-center"
                >
                    <Text className="text-white font-semibold text-sm mr-1">
                        {activeInterval.charAt(0).toUpperCase() +
                            activeInterval.slice(1)}
                    </Text>
                    <RotateCcw
                        className="text-white !ml-2"
                        color="white"
                        size={16}
                    />
                </TouchableOpacity>
            </View>

            {/* Calendar Modal */}
            <Modal
                visible={showCalendar}
                transparent={true}
                animationType="slide"
            >
                <View className="flex-1 bg-black/50 justify-center p-4">
                    <View className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                        {/* Header */}
                        <View className="p-4 border-b border-gray-200 bg-gray-50">
                            <Text className="font-semibold text-lg text-gray-800 text-center">
                                Select Date Range
                            </Text>
                            <Text className="text-gray-600 text-sm text-center mt-1">
                                {isSelectingRange
                                    ? "Select end date"
                                    : "Select start date"}
                            </Text>
                        </View>

                        {/* Calendar */}
                        <View className="p-4">
                            <Calendar
                                current={tempFromDate}
                                markingType="period"
                                markedDates={getMarkedDates()}
                                onDayPress={handleDayPress}
                                theme={{
                                    backgroundColor: "#ffffff",
                                    calendarBackground: "#ffffff",
                                    textSectionTitleColor: "#6B7280",
                                    selectedDayBackgroundColor: "#3B82F6",
                                    selectedDayTextColor: "#ffffff",
                                    todayTextColor: "#3B82F6",
                                    dayTextColor: "#1F2937",
                                    textDisabledColor: "#D1D5DB",
                                    dotColor: "#3B82F6",
                                    selectedDotColor: "#ffffff",
                                    arrowColor: "#3B82F6",
                                    disabledArrowColor: "#D1D5DB",
                                    monthTextColor: "#1F2937",
                                    indicatorColor: "#3B82F6",
                                    textDayFontFamily: "System",
                                    textMonthFontFamily: "System",
                                    textDayHeaderFontFamily: "System",
                                    textDayFontWeight: "400",
                                    textMonthFontWeight: "600",
                                    textDayHeaderFontWeight: "500",
                                    textDayFontSize: 16,
                                    textMonthFontSize: 18,
                                    textDayHeaderFontSize: 14,
                                }}
                                style={{
                                    borderRadius: 12,
                                }}
                            />
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row p-4 border-t border-gray-200 bg-gray-50">
                            <TouchableOpacity
                                onPress={handleCancelSelection}
                                className="flex-1 py-3 px-4 mr-2 bg-gray-200 rounded-xl"
                            >
                                <Text className="text-gray-700 font-semibold text-center">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleConfirmSelection}
                                className="flex-1 py-3 px-4 ml-2 bg-blue-500 rounded-xl"
                            >
                                <Text className="text-white font-semibold text-center">
                                    Confirm
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Installation instructions component
const InstallationInstructions: React.FC = () => {
    return (
        <View className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-4">
            <Text className="font-semibold text-blue-800 mb-2">
                📦 Installation Required:
            </Text>
            <Text className="text-blue-700 text-sm font-mono mb-2">
                npx expo install react-native-calendars
            </Text>
            <Text className="text-blue-600 text-xs">
                This component uses react-native-calendars for the calendar UI
            </Text>
        </View>
    );
};

// Example usage
const ExampleUsage: React.FC = () => {
    const [dateRange, setDateRange] = useState({
        from: "2025-06-03",
        to: "2025-06-18",
    });
    const [interval, setInterval] = useState<IntervalType>("monthly");

    return (
        <View className="flex-1 bg-gray-50 p-4">
            <View className="mt-8">
                <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Calendar Date Selector
                </Text>

                <InstallationInstructions />

                <CalendarDateRangeSelector
                    fromDate={dateRange.from}
                    toDate={dateRange.to}
                    selectedInterval={interval}
                    onDateRangeChange={(from, to) => {
                        setDateRange({ from, to });
                        console.log("Date range changed:", from, to);
                    }}
                    onIntervalChange={(newInterval) => {
                        setInterval(newInterval);
                        console.log("Interval changed:", newInterval);
                    }}
                />

                <View className="mt-6 p-4 bg-white rounded-xl">
                    <Text className="text-gray-600 text-center">
                        Selected: {dateRange.from} to {dateRange.to}
                    </Text>
                    <Text className="text-gray-600 text-center">
                        Interval:{" "}
                        <Text className="font-semibold text-blue-600">
                            {interval}
                        </Text>
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default CalendarDateRangeSelector;
export { ExampleUsage, InstallationInstructions };
