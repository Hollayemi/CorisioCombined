/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";

// Types
export type IntervalType = "daily" | "weekly" | "monthly";

interface AnalyticsPayload {
    dateFrom: string;
    dateTo: string;
    interval: IntervalType;
}

interface ApiResponse {
    // Define your API response structure here
    salesGrowth?: Record<string, any>;
    countItem?: string | number;
    totalSale?: string | number;
    lastGrowth?: string | number;
    data: any;
    success: boolean;
    message?: string;
}

export interface quertParams {
    dateFrom: string;
    dateTo: string;
    interval: IntervalType;
}

interface UseStoreGrowthAnalyticsReturn {
    // State
    selectedInterval: IntervalType;
    setDayFrom: (a: any) => void;
    setDayTo: (a: any) => void;
    dateRange: {
        dateFrom: string;
        dateTo: string;
    };

    // Query results
    data: ApiResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;

    // Actions
    setSelectedInterval: (interval: IntervalType) => void;
    refetch: () => void;

    // Computed values
    queryParams: AnalyticsPayload;
}

export const useStoreGrowthAnalytics = ({
    queryMutation,
    defaultParams,
}: {
    queryMutation: any;
    interval?: IntervalType;
    defaultParams?: quertParams;
}): UseStoreGrowthAnalyticsReturn => {
    let [dateFrom, setDayFrom] = useState<string>("");
    let [dateTo, setDayTo] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    const [selectedInterval, setSelectedInterval] =
        useState<IntervalType>("weekly");

    // Calculate date range based on interval and maximum backward limit of 8
    const calculateDateRange = (
        interval: IntervalType
    ): { dateFrom: string; dateTo: string } => {
        const now = new Date();
        console.log({ dateFrom })
        switch (interval) {
            case "daily":
                // 8 days back
                dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0];
                break;
            case "weekly":
                // 7 weeks back
                dateFrom = new Date(now.getTime() - 7 * 7 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0];
                break;
            case "monthly":
                // 7 months back
                let date = dateFrom ? new Date(dateFrom) : new Date();
                date.setMonth(date.getMonth() - 7);
                dateFrom = date.toISOString().split("T")[0]; // YYYY-MM-DD
                break;
            default:
                dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0];
        }

        return {
            dateFrom,
            dateTo,
        };
    };

    let queryParams;
    // Memoize date range calculation
    const dateRange = useMemo(
        () =>
            !dateFrom
                ? calculateDateRange(selectedInterval)
                : {
                    dateFrom,
                    dateTo,
                },
        [selectedInterval]
    );

    // Memoize query parameters
    queryParams = useMemo(
        () =>
            defaultParams?.dateFrom
                ? defaultParams
                : {
                    dateFrom: dateRange.dateFrom,
                    dateTo: dateRange.dateTo,
                    interval: selectedInterval,
                },
        [dateRange.dateFrom, dateRange.dateTo, selectedInterval, defaultParams]
    );

    console.log({queryParams})
    // RTK Query hook - will automatically refetch when parameters change
    const { data, error, isLoading, isError, refetch } = queryMutation(
        {
            ...queryParams,
            // Only run query when we have valid dates
            skip: !dateRange.dateFrom || !dateRange.dateTo,
        }
    );

    useEffect(() => {
        refetch()
    }, [selectedInterval])

    return {
        // State
        selectedInterval,
        dateRange,

        // Query results
        data,
        isLoading,
        isError,
        error,

        // Actions
        setSelectedInterval,
        setDayFrom,
        setDayTo,
        refetch,

        // Computed values
        queryParams,
    };
};

