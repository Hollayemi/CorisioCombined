// redux/business/slices/authSlice.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { router } from 'expo-router';
import { axiosBaseQuery } from './api/axiosBaseQuery';

// ─────────────────────────────────────────────────────────────────────────────
// RTK Query API
// ─────────────────────────────────────────────────────────────────────────────

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Auth', 'StoreProfile', 'Completion'],
    endpoints: (builder) => ({

        // POST /stores/auth/send-otp
        // Body:    { phoneNumber: "+2348012345678" }
        // Returns: { success, message, data: { phoneNumber, message, otp? } }
        sendOtp: builder.mutation<AuthResponse, SendOtpPayload>({
            query: (payload: SendOtpPayload) => ({
                url: '/stores/auth/send-otp',
                method: 'POST',
                data: payload,
            }),
        }),

        // POST /stores/auth/verify-otp
        // Body:    { phoneNumber, otp }
        // Returns: { success, message, data: { store, token, refreshToken } }
        verifyOtp: builder.mutation<AuthResponse, VerifyOtpPayload>({
            query: (payload) => ({
                url: '/stores/auth/verify-otp',
                method: 'POST',
                data: payload,
            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.data?.token && data.data?.refreshToken && data.data.store) {
                        dispatch(setCredentials({
                            token: data.data.token,
                            refreshToken: data.data.refreshToken,
                            store: data.data.store,
                        }));
                    }
                } catch (error) {
                    console.error('OTP verification failed:', error);
                }
            },
        }),

        // POST /stores/auth/resend-otp
        // Body:    { phoneNumber }
        // Returns: { success, message }
        resendOtp: builder.mutation<AuthResponse, {phoneNumber: string;}>({
            query: (payload) => ({
                url: '/stores/auth/resend-otp',
                method: 'POST',
                data: payload,
            }),
        }),

        // POST /stores/auth/refresh-token
        // Body:    { refreshToken }
        // Returns: { success, data: { token, refreshToken } }
        refreshAuthToken: builder.mutation<AuthResponse, { refreshToken: string }>({
            query: (payload) => ({
                url: '/stores/auth/refresh-token',
                method: 'POST',
                data: payload,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.data?.token && data.data.refreshToken) {
                        dispatch(setTokens({
                            token: data.data.token,
                            refreshToken: data.data.refreshToken,
                        }));
                    }
                } catch (error) {
                    // Refresh failed — session is dead, force logout
                    console.error('Token refresh failed:', error);
                    dispatch(logoutUser());
                }
            },
        }),

        // POST /stores/auth/logout
        // No body required — bearer token in header identifies the store
        logout: builder.mutation<AuthResponse, void>({
            query: () => ({
                url: '/stores/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['Auth', 'StoreProfile'],
            async onQueryStarted(_, { dispatch }) {
                // Clear state immediately, don't wait for server response
                dispatch(logoutUser());
            },
        }),

        // POST /stores/register
        // Body:    { storeName, ownerInfo, category (ObjectId), address, description?, website?, referralCode?, openingHours? }
        // Returns: { success, data: { store: { id, storeName, onboardingStatus, profileCompletionScore, referralCode } } }
        // Note:    Requires bearer token from verifyOtp. Transitions onboardingStatus → "profile_complete"
        registerStore: builder.mutation<AuthResponse, RegisterStorePayload>({
            query: (payload) => ({
                url: '/stores/register',
                method: 'POST',
                data: payload,
            }),
            invalidatesTags: ['StoreProfile', 'Completion'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.data?.store) {
                        dispatch(updateStoreData(data.data.store));
                    }
                } catch (error) {
                    console.error('Store registration failed:', error);
                }
            },
        }),

        // PUT /stores/profile
        // Body:    { description?, openingHours?, website?, storeName?, ownerInfo?, address? }
        // Returns: { success, data: { store } }
        updateProfile: builder.mutation<AuthResponse, UpdateProfilePayload>({
            query: (payload) => ({
                url: '/stores/profile',
                method: 'PUT',
                data: payload,
            }),
            invalidatesTags: ['StoreProfile', 'Completion'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.data?.store) {
                        dispatch(updateStoreData(data.data.store));
                    }
                } catch (error) {
                    console.error('Profile update failed:', error);
                }
            },
        }),

        // GET /stores/me
        // Returns: { success, data: { store: { id, storeName, ownerInfo, phoneNumber, category, address, onboardingStatus, ... } } }
        getMyStore: builder.query<AuthResponse, void>({
            query: () => ({
                url: '/stores/me',
                method: 'GET',
            }),
            providesTags: ['StoreProfile'],
        }),

        // GET /stores/profile/completion
        // Returns: { success, data: { score, readyForVerification, checklist: [...] } }
        getProfileCompletion: builder.query<AuthResponse, void>({
            query: () => ({
                url: '/stores/profile/completion',
                method: 'GET',
            }),
            providesTags: ['Completion'],
        }),
    }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Async helper to rehydrate state from AsyncStorage on app launch
// ─────────────────────────────────────────────────────────────────────────────

const initializeAuthState = async (): Promise<Partial<AuthState>> => {
    try {
        const token = await AsyncStorage.getItem('store_token');
        const refreshToken = await AsyncStorage.getItem('store_refresh_token');
        const storeDataString = await AsyncStorage.getItem('store_data');
        const storeData = storeDataString ? JSON.parse(storeDataString) : null;

        return {
            store: storeData,
            token,
            refreshToken,
            isAuthenticated: !!token,
            loading: false,
            error: null,
        };
    } catch (error) {
        return {
            store: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            loading: false,
            error: null,
        };
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Initial state
// ─────────────────────────────────────────────────────────────────────────────

const initialState: AuthState = {
    store: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Auth slice
// ─────────────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Called after verifyOtp success — stores token + refreshToken + store
        setCredentials: (state, action: PayloadAction<{
            token: string;
            refreshToken: string;
            store: StoreData;
        }>) => {
            const { token, refreshToken, store } = action.payload;
            state.store = store;
            state.token = token;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;
            state.error = null;

            AsyncStorage.setItem('store_token', token);
            AsyncStorage.setItem('store_refresh_token', refreshToken);
            AsyncStorage.setItem('store_data', JSON.stringify(store));
        },

        // Called after refreshAuthToken success — updates tokens only
        setTokens: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;

            AsyncStorage.setItem('store_token', action.payload.token);
            AsyncStorage.setItem('store_refresh_token', action.payload.refreshToken);
        },

        // Called after registerStore / updateProfile to patch store fields
        updateStoreData: (state, action: PayloadAction<Partial<StoreData>>) => {
            if (state.store) {
                state.store = { ...state.store, ...action.payload };
                AsyncStorage.setItem('store_data', JSON.stringify(state.store));
            }
        },

        logoutUser: (state) => {
            state.store = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.error = null;

            AsyncStorage.multiRemove(['store_token', 'store_refresh_token', 'store_data']);

            router.replace('/business/auth/files/PhoneEntry');
        },

        clearError: (state) => {
            state.error = null;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },

        initializeAuth: (state, action: PayloadAction<Partial<AuthState>>) => {
            Object.assign(state, action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // Sync full store profile into Redux when getMyStore resolves
            .addMatcher(
                authApi.endpoints.getMyStore.matchFulfilled,
                (state, action) => {
                    if (action.payload.data?.store) {
                        state.store = action.payload.data.store;
                        AsyncStorage.setItem('store_data', JSON.stringify(state.store));
                    }
                }
            );
    },
});

export const {
    setCredentials,
    setTokens,
    updateStoreData,
    logoutUser,
    clearError,
    setLoading,
    setError,
    initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;

// ─────────────────────────────────────────────────────────────────────────────
// Exported hooks
// ─────────────────────────────────────────────────────────────────────────────

export const {
    useSendOtpMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useRefreshAuthTokenMutation,
    useLogoutMutation,
    useRegisterStoreMutation,
    useUpdateProfileMutation,
    useGetMyStoreQuery,
    useGetProfileCompletionQuery,
} = authApi;

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────

export const selectCurrentStore = (state: { auth: AuthState }) => state.auth.store;
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectOnboardingStatus = (state: { auth: AuthState }) => state.auth.store?.onboardingStatus;

// ─────────────────────────────────────────────────────────────────────────────
// Async action — rehydrate from AsyncStorage on app launch
// ─────────────────────────────────────────────────────────────────────────────

export const initializeAuthAsync = () => async (dispatch: any) => {
    const authState = await initializeAuthState();
    dispatch(initializeAuth(authState));
};

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthState {
    store: StoreData | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// Matches data.store from verify-otp and /stores/me responses
export interface StoreData {
    id: string;
    storeName: string;
    ownerInfo: string;
    phoneNumber: string;
    onboardingStatus: OnboardingStatus;
    referralCode: string;
    profileCompletionScore?: number;
    boost?: {
        level: 'none' | 'bronze' | 'silver' | 'gold';
        totalReferrals: number;
        expiresAt?: string;
        isActive?: boolean;
    };
    category?: { _id: string; name: string };
    address?: {
        raw: string;
        lga: string;
        state: string;
        coordinates?: {
            type: 'Point';
            coordinates: [number, number]; // [lng, lat]
        };
    };
    description?: string;
    website?: string;
    photos?: string[];
    openingHours?: OpeningHour[];
    isPhoneVerified?: boolean;
    isFeatured?: boolean;
    rejectionReason?: string;
}

export type OnboardingStatus =
    | 'registered'
    | 'phone_verified'
    | 'profile_complete'
    | 'verified'
    | 'rejected';

export interface OpeningHour {
    day: string;   // "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
    open: string;  // "08:00"
    close: string; // "20:00"
    isClosed: boolean;
}

// Unified API response wrapper matching Corisio's envelope shape
export interface AuthResponse {
    success: boolean;
    type: 'success' | 'error';
    message: string;
    data?: {
        // verify-otp
        token?: string;
        refreshToken?: string;
        store?: StoreData;
        // send-otp / resend-otp
        phoneNumber?: string;
        otp?: string; // only present in dev mode
        // profile/completion
        score?: number;
        readyForVerification?: boolean;
        checklist?: CompletionChecklistItem[];
    };
    timestamp?: string;
}

export interface CompletionChecklistItem {
    field: string;
    label: string;
    complete: boolean;
    points: number;
    required: boolean;
}

// POST /stores/auth/send-otp  &  POST /stores/auth/resend-otp
interface SendOtpPayload {
    phoneNumber: string; // must be normalised: "+2348012345678"
    category: Record<string, []>;
}

// POST /stores/auth/verify-otp
interface VerifyOtpPayload {
    phoneNumber: string;
    otp: string;
}

// POST /stores/register
export interface RegisterStorePayload {
    storeName: string;
    ownerInfo: string;
    category: {}; // category ObjectId string
    address: {
        raw: string;
        lga: string;
        state?: string;
        coordinates?: {
            type: 'Point';
            coordinates: [number, number]; // [lng, lat]
        };
    };
    description?: string;
    website?: string;
    referralCode?: string;
    openingHours?: OpeningHour[];
}

// PUT /stores/profile
export interface UpdateProfilePayload {
    storeName?: string;
    ownerInfo?: string;
    description?: string;
    website?: string;
    openingHours?: OpeningHour[];
    address?: Partial<RegisterStorePayload['address']>;
}
