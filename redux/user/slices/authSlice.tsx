// store/slices/authSlice.ts
import {
  AuthState,
  ChangeEmailData,
  ChangePasswordData,
  LoginCredentials,
  OtpData,
  RegisterData,
  ResetPasswordData,
  User
} from '@/config/props/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { router } from 'expo-router';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

// RTK Query API

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<any, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // Register
    register: builder.mutation<any, RegisterData>({
      query: (userData) => ({
        url: '/auth/create-account',
        method: 'POST',
        data: userData,
      }),
    }),

    // Verify OTP
    verifyOtp: builder.mutation<any, OtpData>({
      query: (otpData) => ({
        url: '/auth/verify',
        method: 'POST',
        data: otpData,
      }),
    }),

    // Resend OTP
    resendOtp: builder.mutation<any, { email: string, accountType?: "user" }>({
      query: (data) => ({
        url: '/new/otp',
        method: 'POST',
        data,
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation<any, ResetPasswordData>({
      query: (resetData) => ({
        url: '/auth/reset-password',
        method: 'PATCH',
        data: resetData,
      }),
    }),

    // Change Password
    changePassword: builder.mutation<any, ChangePasswordData>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['User'],
    }),

    // Change Email
    changeEmail: builder.mutation<any, ChangeEmailData>({
      query: (data) => ({
        url: '/auth/change-email',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['User'],
    }),

    // Verify 2FA
    verify2FA: builder.mutation<any, { code: string }>({
      query: (data) => ({
        url: '/auth/verify-2fa',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['User'],
    }),

    // Get User Profile
    getUserProfile: builder.query<User, void>({
      query: () => ({
        url: '/auth/profile',
        method: 'GET',
        actor: 'user',
      }),
      providesTags: ['User'],
    }),

    // Logout
    logout: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/logout-device',
        method: 'POST',
        actor: 'user',
      }),
      invalidatesTags: ['User'],
    }),

    // Refresh Token
    refreshToken: builder.mutation<any, { refreshToken: string }>({
      query: (data) => ({
        url: '/auth/refresh-token',
        method: 'POST',
        data,
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useChangeEmailMutation,
  useVerify2FAMutation,
  useGetUserProfileQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;

// Helper function to initialize state asynchronously
const initializeAuthState = async (): Promise<Partial<AuthState>> => {
  try {
    const token = await AsyncStorage.getItem('user_token');
    const userDataString = await AsyncStorage.getItem('user_data');
    const userData = userDataString ? JSON.parse(userDataString) : null;

    return {
      user: userData,
      token,
      isAuthenticated: !!token,
      loading: false,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }
};

// Initial state (will be overridden by initializeAuthState)
const initialState: AuthState = {
  user: null,
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
      user: User;
      admin?: boolean;
    }>) => {
      const { accessToken, user, admin } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
      state.error = null;

      // Store in AsyncStorage
      const tokenKey = admin ? 'store_token' : 'user_token';
      AsyncStorage.setItem(tokenKey, accessToken);
      AsyncStorage.setItem('user_data', JSON.stringify(user));
    },

    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear AsyncStorage
      AsyncStorage.multiRemove(['store_token', 'user_token', 'refresh_token', 'user_data']);

      // Navigate to login
      router.push('/auth/Login');
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

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update AsyncStorage
        AsyncStorage.setItem('user_data', JSON.stringify(state.user));
      }
    },

    initializeAuth: (state, action: PayloadAction<Partial<AuthState>>) => {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addMatcher(
        authApi.endpoints.login.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, action) => {
          state.loading = false;
          if (action.payload?.accessToken && action.payload?.user) {
            state.user = action.payload.user;
            state.token = action.payload.accessToken;
            state.isAuthenticated = true;

            // Store in AsyncStorage
            AsyncStorage.setItem('user_token', action.payload.accessToken);
            AsyncStorage.setItem('user_data', JSON.stringify(action.payload.user));
          }
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Login failed';
        }
      )
      // Register
      .addMatcher(
        authApi.endpoints.register.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        authApi.endpoints.register.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Registration failed';
        }
      )
      // Verify OTP
      .addMatcher(
        authApi.endpoints.verifyOtp.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.verifyOtp.matchFulfilled,
        (state, action) => {
          state.loading = false;
          if (action.payload?.accessToken && action.payload?.user) {
            state.user = action.payload.user;
            state.token = action.payload.accessToken;
            state.isAuthenticated = true;

            // Store in AsyncStorage
            AsyncStorage.setItem('user_token', action.payload.accessToken);
            AsyncStorage.setItem('user_data', JSON.stringify(action.payload.user));
          }
        }
      )
      .addMatcher(
        authApi.endpoints.verifyOtp.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'OTP verification failed';
        }
      )
      // Logout
      .addMatcher(
        authApi.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.error = null;

          // Clear AsyncStorage
          AsyncStorage.multiRemove(['store_token', 'user_token', 'refresh_token', 'user_data']);

          // Navigate to login
          router.push('/auth/Login');
        }
      )
      // Get User Profile
      .addMatcher(
        authApi.endpoints.getUserProfile.matchFulfilled,
        (state, action) => {
          state.user = action.payload;
          // Update AsyncStorage
          AsyncStorage.setItem('user_data', JSON.stringify(action.payload));
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

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Async action to initialize auth state
export const initializeAuthAsync = () => async (dispatch: any) => {
  const authState = await initializeAuthState();
  dispatch(initializeAuth(authState));
};
