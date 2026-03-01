import { otpAction, reqStaffInfo } from '../../../helper/prop';
// store/slices/authSlice.ts

import { regStoreInfo } from '@/helper/prop';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import * as Device from 'expo-device';
import { router } from 'expo-router';
import { axiosBaseQuery } from './api/axiosBaseQuery';

// RTK Query API
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        // Store endpoints
        createNewStore: builder.mutation<AuthResponse, { user: reqStaffInfo, store: regStoreInfo }>({
            query: (payload) => ({
                url: '/store/new',
                method: 'POST',
                data: payload,
            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // if (data.accessToken) {
                    //     dispatch(setCredentials({
                    //         accessToken: data.accessToken,
                    //         store: data.store
                    //     }));
                    // }
                } catch (error) {
                    console.error('Account Creation Failed', error);
                }
            },
        }),

        verifyOtp: builder.mutation<any, VerifyOtpProp>({
            query: (payload) => ({
                url: '/auth/verify',
                method: 'POST',
                data: payload,
            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.accessToken) {
                        dispatch(setCredentials({
                            accessToken: data.accessToken,
                            store: data.store
                        }));
                    }
                } catch (error) {
                    console.error('OTP verification failed:', error);
                }
            },
        }),

        resendOTP: builder.mutation<AuthResponse, { email: string; accountType?: "staff", action: otpAction }>({
            query: (payload) => ({
                url: '/new/otp',
                method: 'POST',
                data: payload,
            }),
        }),

        // Auth endpoints
        storeLogin: builder.mutation<AuthResponse, LoginPayload>({
            query: (payload) => ({
                url: '/dashboard/login',
                method: 'POST',
                params:{
                    deviceName: Device.deviceName,
                    brand: Device.brand,
                    model: Device.modelName,
                    os: `${Device.osName} ${Device.osVersion}`,
                    deviceType: Device.deviceType === 1 ? 'Phone' : 'Tablet'},
                data: payload,
            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.accessToken) {
                        dispatch(setCredentials({
                            accessToken: data.accessToken,
                            store: data.store
                        }));
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),

        getStaffAccount: builder.query<StaffAccount, void>({
            query: () => ({
                url: "/store/get-account",
                method: "GET",
            }),
            providesTags: ['Auth'],
        }),

        forgotPassword: builder.mutation<any, { email: string, accountType: 'staff' }>({
            query: (data) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                data,
            }),
        }),

        // Password endpoints
        resetPassword: builder.mutation<AuthResponse, ResetPasswordData>({
            query: (payload) => ({
                url: "/branch/staff/reset-password",
                method: "POST",
                data: payload,
            }),
        }),

        changePassword: builder.mutation<AuthResponse, ChangePasswordPayload>({
            query: (payload) => ({
                url: "/branch/staff/change-password",
                method: "POST",
                data: payload,
            }),
        }),

        changeEmail: builder.mutation<AuthResponse, ChangeEmailPayload>({
            query: (payload) => ({
                url: "/staff/change-email",
                method: "POST",
                data: payload,
            }),
        }),

        // Logout endpoint
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(_, { dispatch }) {
                dispatch(logoutUser());
            },
        }),
    }),
});

// Helper function to initialize state asynchronously
const initializeAuthState = async (): Promise<Partial<AuthState>> => {
    try {
        const token = await AsyncStorage.getItem('store_token');
        const storeDataString = await AsyncStorage.getItem('store_data');
        const storeData = storeDataString ? JSON.parse(storeDataString) : null;

        return {
            store: storeData,
            token,
            isAuthenticated: !!token,
            loading: false,
            error: null,
        };
    } catch (error) {
        return {
            store: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
        };
    }
};

// Initial state
const initialState: AuthState = {
    store: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{
            accessToken: string;
            store: any;
        }>) => {
            const { accessToken, store } = action.payload;
            state.store = store;
            state.token = accessToken;
            state.isAuthenticated = true;
            state.error = null;

            // Store in AsyncStorage
            AsyncStorage.setItem('store_token', accessToken);
            AsyncStorage.setItem('store_data', JSON.stringify(store));
        },

        logoutUser: (state) => {
            state.store = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            // Clear AsyncStorage
            AsyncStorage.multiRemove(['store_token', 'store_data']);

            // Navigate to login
            router.push('/business/auth/Login');
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

        updateUser: (state, action: PayloadAction<Partial<any>>) => {
            if (state.store) {
                state.store = { ...state.store, ...action.payload };
                AsyncStorage.setItem('store_data', JSON.stringify(state.store));
            }
        },

        initializeAuth: (state, action: PayloadAction<Partial<AuthState>>) => {
            Object.assign(state, action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle successful queries that return store data
            .addMatcher(
                authApi.endpoints.getStaffAccount.matchFulfilled,
                (state, action) => {
                    state.store = action.payload;
                    AsyncStorage.setItem('store_data', JSON.stringify(action.payload));
                }
            )
            // Handle token refresh if needed
            .addMatcher(
                authApi.endpoints.verifyOtp.matchFulfilled,
                (state, action) => {
                    if (action.payload.accessToken) {
                        state.token = action.payload.accessToken;
                        AsyncStorage.setItem('store_token', action.payload.accessToken);
                    }
                }
            );
    },
});

export const {
    setCredentials,
    logoutUser,
    clearError,
    setLoading,
    setError,
    updateUser,
    initializeAuth
} = authSlice.actions;

export default authSlice.reducer;

// Export hooks for usage in components
export const {
    useCreateNewStoreMutation,
    useVerifyOtpMutation,
    useResendOTPMutation,
    useStoreLoginMutation,
    useGetStaffAccountQuery,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useChangeEmailMutation,
    useLogoutMutation,
} = authApi;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.store;
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Async action to initialize auth state
export const initializeAuthAsync = () => async (dispatch: any) => {
    const authState = await initializeAuthState();
    dispatch(initializeAuth(authState));
};

export interface AuthState {
    store: any | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// Types
interface AuthResponse {
    success: boolean;
    message: string;
    accessToken: string;
    store: any;
    type: 'success' | 'error';
    data?: any;
}

interface StorePayload {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

interface LoginPayload {
    store: string;
    username: string;
    password: string;
}

interface ResetPasswordData {
    email: string;
    token: string;
    password: string;
}

interface VerifyOtpProp {
    email: string;
    otp: string,
    returnToken?: boolean,
    accountType?: string
}
interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ChangeEmailPayload {
    newEmail: string;
    password: string;
}

interface StaffAccount {
    id: string;
    email: string;
    name: string;
    role: string;
    storeId?: string;
}