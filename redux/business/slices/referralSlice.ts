// redux/business/slices/referralSlice.ts
// Covers: Store referral code, my referrals list, stats, boost status, send SMS

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api/axiosBaseQuery';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BoostLevel = 'none' | 'bronze' | 'silver' | 'gold';
export type ReferralStatus = 'pending' | 'profileComplete' | 'validated' | 'rejected';
export type ReferralChannel = 'sms' | 'link' | 'manual';

export interface BoostInfo {
    level: BoostLevel;
    activatedAt?: string;
    expiresAt?: string;
    totalReferrals: number;
    source?: string;
}

export interface ReferralCodeData {
    referralCode: string;
    shareableLink: string;
    qrCodeUrl: string;
}

export interface ReferralSummary {
    total: number;
    pending: number;
    profileComplete: number;
    validated: number;
    rejected: number;
}

export interface ReferralItem {
    _id: string;
    status: ReferralStatus;
    channel: ReferralChannel;
    boostApplied: boolean;
    boostAppliedAt?: string;
    referred: {
        storeName: string;
        onboardingStatus: string;
        address?: {
            lga?: string;
        };
    };
    milestones: {
        registeredAt?: string;
        adminVerifiedAt?: string;
        validatedAt?: string;
    };
}

export interface MyReferralsData {
    summary: ReferralSummary;
    referrals: ReferralItem[];
}

export interface MilestoneInfo {
    required: number;
    duration: string;
    reached: boolean;
}

export interface ReferralStatsData {
    boost: BoostInfo;
    validatedReferrals: number;
    progress: {
        currentLevel: BoostLevel;
        nextLevel: BoostLevel | null;
        referralsToNext: number;
    };
    milestones: {
        bronze: MilestoneInfo;
        silver: MilestoneInfo;
        gold: MilestoneInfo;
    };
}

export interface BoostStatusData {
    boost: BoostInfo;
    isActive: boolean;
    daysRemaining: number;
}

interface ApiResponse<T> {
    success: boolean;
    type?: 'success' | 'error';
    message: string;
    data: T;
}

// ─── API Slice ─────────────────────────────────────────────────────────────────

export const referralApi = createApi({
    reducerPath: 'referralApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Referral', 'BoostStatus'],
    endpoints: (builder) => ({

        // ── GET /stores/referral/my-code ─────────────────────────────────────
        // Returns referral code, shareable link, and QR code URL
        getMyReferralCode: builder.query<ApiResponse<ReferralCodeData>, void>({
            query: () => ({
                url: '/stores/referral/my-code',
                method: 'GET',
            }),
            providesTags: ['Referral'],
        }),

        // ── GET /stores/referral/my-referrals ───────────────────────────────
        // Returns summary counts + full referral list with milestones
        getMyReferrals: builder.query<ApiResponse<MyReferralsData>, void>({
            query: () => ({
                url: '/stores/referral/my-referrals',
                method: 'GET',
            }),
            providesTags: ['Referral'],
        }),

        // ── GET /stores/referral/stats ───────────────────────────────────────
        // Returns boost level, progress to next tier, milestone breakdown
        getReferralStats: builder.query<ApiResponse<ReferralStatsData>, void>({
            query: () => ({
                url: '/stores/referral/stats',
                method: 'GET',
            }),
            providesTags: ['Referral'],
        }),

        // ── GET /stores/boost/status ─────────────────────────────────────────
        // Current boost level, active state, days remaining
        getBoostStatus: builder.query<ApiResponse<BoostStatusData>, void>({
            query: () => ({
                url: '/stores/boost/status',
                method: 'GET',
            }),
            providesTags: ['BoostStatus'],
        }),

        // ── POST /stores/referral/send-sms ───────────────────────────────────
        // Send referral invite via SMS to a phone number (max 5/day)
        sendReferralSms: builder.mutation<ApiResponse<null>, { phoneNumber: string }>({
            query: (payload) => ({
                url: '/stores/referral/send-sms',
                method: 'POST',
                data: payload,
            }),
        }),
    }),
});

// ─── Exported Hooks ───────────────────────────────────────────────────────────

export const {
    useGetMyReferralCodeQuery,
    useGetMyReferralsQuery,
    useGetReferralStatsQuery,
    useGetBoostStatusQuery,
    useSendReferralSmsMutation,
} = referralApi;
