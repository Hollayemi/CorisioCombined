// redux/business/slices/engagementSlice.ts
// Covers: per-store engagement analytics + platform-wide engagement (admin)

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api/axiosBaseQuery';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EngagementTotals {
    profileViews: number;
    listingClicks: number;
    callClicks: number;
    directionClicks: number;
}

export interface DailyEngagement extends EngagementTotals {
    date: string; // "YYYY-MM-DD"
}

export interface LifetimeTotals {
    profileViews: number;
    searchAppearances: number;
    clickThroughs: number;
}

export interface StoreEngagementData {
    store: {
        id: string;
        storeName: string;
        boostLevel: string;
    };
    period: {
        startDate: string;
        endDate: string;
    };
    totals: EngagementTotals;
    daysWithActivity: number;
    daily: DailyEngagement[];
    lifetimeTotals: LifetimeTotals;
}

export interface PlatformEngagementData {
    period: {
        startDate: string;
        endDate: string;
    };
    totals: EngagementTotals;
    conversionRates: {
        callConversionPct: number;
        directionConversionPct: number;
    };
    daily: DailyEngagement[];
}

export interface EngagementQueryParams {
    startDate?: string; // "YYYY-MM-DD" — defaults to 30 days ago
    endDate?: string;   // "YYYY-MM-DD" — defaults to today
}

interface ApiResponse<T> {
    success: boolean;
    type: 'success' | 'error';
    message: string;
    data: T;
}

// ─── API Slice ─────────────────────────────────────────────────────────────────

export const engagementApi = createApi({
    reducerPath: 'engagementApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Engagement'],
    endpoints: (builder) => ({

        // ── GET /admin/analytics/engagement/:storeId ─────────────────────────
        // Per-store engagement: totals, daily breakdown, lifetime stats
        // Used by: store owner insights screen, admin store detail view
        getStoreEngagement: builder.query<
            ApiResponse<StoreEngagementData>,
            { storeId: string } & EngagementQueryParams
        >({
            query: ({ storeId, startDate, endDate }) => ({
                url: `/admin/analytics/engagement/${storeId}`,
                method: 'GET',
                params: {
                    ...(startDate && { startDate }),
                    ...(endDate && { endDate }),
                },
            }),
            providesTags: (_result, _error, { storeId }) => [
                { type: 'Engagement', id: storeId },
            ],
        }),

        // ── GET /admin/analytics/engagement ──────────────────────────────────
        // Platform-wide engagement: totals, conversion rates, daily breakdown
        // Used by: admin analytics dashboard
        getPlatformEngagement: builder.query<
            ApiResponse<PlatformEngagementData>,
            EngagementQueryParams | void
        >({
            query: (params) => ({
                url: '/admin/analytics/engagement',
                method: 'GET',
                params: {
                    ...(params?.startDate && { startDate: params.startDate }),
                    ...(params?.endDate && { endDate: params.endDate }),
                },
            }),
            providesTags: [{ type: 'Engagement', id: 'PLATFORM' }],
        }),
    }),
});

// ─── Exported Hooks ───────────────────────────────────────────────────────────

export const {
    useGetStoreEngagementQuery,
    useGetPlatformEngagementQuery,
} = engagementApi;
