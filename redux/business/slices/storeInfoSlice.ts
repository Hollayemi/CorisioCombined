// redux/business/slices/storeInfoSlice.ts
// Covers: Store Profile, Onboarding, Completion & Analytics

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api/axiosBaseQuery';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoreAddress {
    raw: string;
    lga: string;
    state: string;
    coordinates: {
        type: 'Point';
        coordinates: [number, number]; // [lng, lat]
    };
}

export interface OpeningHourEntry {
    day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
    open: string;   // "08:00"
    close: string;  // "20:00"
    isClosed: boolean;
}

export interface StoreBoost {
    level: 'none' | 'bronze' | 'silver' | 'gold';
    activatedAt?: string;
    expiresAt?: string;
    totalReferrals: number;
    source?: string;
}

export interface StoreProfile {
    id: string;
    storeName: string;
    ownerName: string;
    phoneNumber: string;
    category: {
        _id: string;
        name: string;
    };
    address: StoreAddress;
    description?: string;
    website?: string;
    openingHours?: OpeningHourEntry[];
    onboardingStatus: 'phone_verified' | 'registered' | 'profile_complete' | 'verified' | 'rejected';
    rejectionReason?: string;
    isPhoneVerified: boolean;
    profileCompletionScore: number;
    referralCode: string;
    boost: StoreBoost;
    photos: string[];
    isActive: boolean;
}

export interface RegisterStorePayload {
    storeName: string;
    ownerName: string;
    category: string;           // ObjectId
    address: StoreAddress;
    referralCode?: string;
    description?: string;
    openingHours?: OpeningHourEntry[];
    website?: string;
}

export interface UpdateStoreProfilePayload {
    storeName?: string;
    ownerName?: string;
    description?: string;
    website?: string;
    openingHours?: OpeningHourEntry[];
    address?: Partial<StoreAddress>;
}

export interface ChecklistItem {
    field: string;
    label: string;
    complete: boolean;
    points: number;
    required: boolean;
}

export interface ProfileCompletion {
    score: number;
    readyForVerification: boolean;
    checklist: ChecklistItem[];
}

export interface StoreAnalytics {
    profileViews: number;
    searchAppearances: number;
    clickThroughs: number;
    ctr: string;
    validatedReferrals: number;
    boost: StoreBoost & {
        activatedAt: string;
        expiresAt: string;
    };
}

interface ApiResponse<T> {
    success: boolean;
    type: 'success' | 'error';
    message: string;
    data: T;
    timestamp?: string;
}

// ─── API Slice ─────────────────────────────────────────────────────────────────

export const storeInfoApi = createApi({
    reducerPath: 'storeInfoApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['StoreInfo', 'Completion', 'Analytics'],
    endpoints: (builder) => ({

        // ── GET /stores/me ──────────────────────────────────────────────────
        // Fetch the authenticated store's full profile
        getMyStore: builder.query<ApiResponse<{ store: StoreProfile }>, void>({
            query: () => ({
                url: '/stores/me',
                method: 'GET',
            }),
            providesTags: ['StoreInfo'],
        }),

        // ── POST /stores/register ───────────────────────────────────────────
        // Submit profile during onboarding (first time)
        registerStore: builder.mutation<
            ApiResponse<{ store: Pick<StoreProfile, 'id' | 'storeName' | 'onboardingStatus' | 'profileCompletionScore' | 'referralCode'> }>,
            RegisterStorePayload
        >({
            query: (payload) => ({
                url: '/stores/register',
                method: 'POST',
                data: payload,
            }),
            invalidatesTags: ['StoreInfo', 'Completion'],
        }),

        // ── PUT /stores/profile ─────────────────────────────────────────────
        // Update any part of the store profile after onboarding
        updateStoreProfile: builder.mutation<
            ApiResponse<{ store: StoreProfile }>,
            UpdateStoreProfilePayload
        >({
            query: (payload) => ({
                url: '/stores/profile',
                method: 'PUT',
                data: payload,
            }),
            invalidatesTags: ['StoreInfo', 'Completion'],
        }),

        // ── GET /stores/profile/completion ──────────────────────────────────
        // Profile completion score + checklist breakdown
        getProfileCompletion: builder.query<ApiResponse<ProfileCompletion>, void>({
            query: () => ({
                url: '/stores/profile/completion',
                method: 'GET',
            }),
            providesTags: ['Completion'],
        }),

        // ── POST /stores/upload-photo ───────────────────────────────────────
        // Upload a store photo (multipart or base64 depending on server)
        uploadStorePhoto: builder.mutation<ApiResponse<{ photoUrl: string }>, FormData>({
            query: (formData) => ({
                url: '/stores/upload-photo',
                method: 'POST',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
            invalidatesTags: ['StoreInfo', 'Completion'],
        }),

        // ── GET /stores/analytics/me ────────────────────────────────────────
        // Profile views, CTR, search appearances, boost info
        getMyStoreAnalytics: builder.query<ApiResponse<StoreAnalytics>, void>({
            query: () => ({
                url: '/stores/analytics/me',
                method: 'GET',
            }),
            providesTags: ['Analytics'],
        }),
    }),
});

// ─── Exported Hooks ────────────────────────────────────────────────────────────

export const {
    // Queries
    useGetMyStoreQuery,
    useGetProfileCompletionQuery,
    useGetMyStoreAnalyticsQuery,

    // Mutations
    useRegisterStoreMutation,
    useUpdateStoreProfileMutation,
    useUploadStorePhotoMutation,
} = storeInfoApi;
