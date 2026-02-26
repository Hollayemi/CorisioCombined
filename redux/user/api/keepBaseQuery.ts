// utils/axiosBaseQuery.ts
import { jwtDecode, JwtPayload } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid, Platform, Alert } from 'react-native';

// Environment configuration
const isDevelopment = __DEV__;
export const server = isDevelopment
    ? "http://172.20.10.8:5001"
    : "https://corislo-backend.onrender.com";

// Types
interface CustomJwtPayload extends JwtPayload {
    exp: number;
}

interface RequestConfig {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    actor?: 'user' | 'store';
    params?: Record<string, any>;
    headers?: Record<string, string>;
    skipSuccessToast?: boolean;
}

interface ApiResponse<T = any> {
    data?: T;
    error?: {
        status: number;
        data: any;
        message: string;
    };
}

interface ResponseData {
    type?: string;
    message?: string;
}

interface TokenStatus {
    isValid: boolean;
    needsRefresh: boolean;
}

// Toast utility for React Native
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
        // For iOS, you might want to use a toast library or Alert
        Alert.alert(type === 'success' ? 'Success' : 'Error', message);
    }
};

// Get authentication headers
const getAuthHeaders = async (by: 'user' | 'store' = 'user'): Promise<Record<string, string>> => {
    const tokenType = by === 'user' ? 'user_token' : 'store_token';
    const token = await AsyncStorage.getItem(tokenType) || '';

    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// Show success toast
const showSuccessToast = (data: ResponseData) => {
    const { type, message } = data || {};
    if (type === 'success' && message && message !== 'success') {
        showToast(message, 'success');
    }
};

// Main query function
export const axiosBaseQuery = (tokenOwner?: 'user' | 'store') =>
    async (requestConfig: RequestConfig): Promise<ApiResponse> => {
        const {
            url,
            method = 'GET',
            data,
            actor,
            params,
            headers = {},
            skipSuccessToast = false,
        } = requestConfig;

        try {
            // Build headers
            const authHeaders = await getAuthHeaders(tokenOwner || actor || 'user');
            const mergedHeaders = { ...authHeaders, ...headers };

            // Build URL with params
            const fullUrl = new URL(`${server}/api/v1${url}`);
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        fullUrl.searchParams.append(key, String(value));
                    }
                });
            }

            const response = await fetch(fullUrl.toString(), {
                method,
                headers: mergedHeaders,
                body: data ? JSON.stringify(data) : undefined,
            });

            // Parse response
            let responseData: any;
            try {
                responseData = await response.json();
            } catch {
                responseData = null;
            }

            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}`) as any;
                error.response = response;
                error.data = responseData;
                throw error;
            }

            // Handle success message
            if (!skipSuccessToast) {
                showSuccessToast(responseData as ResponseData);
            }

            return { data: responseData };

        } catch (error: any) {
            const status = error.response?.status || 0;
            const errorMessage = error.data?.message || error.message || 'An error occurred';

            showToast(errorMessage, 'error');

            return {
                error: {
                    status,
                    data: error.data || { message: error.message },
                    message: error.message,
                }
            };
        }
    };

// Token validation
const checkTokenStatus = async (account: 'user' | 'store' = 'user'): Promise<TokenStatus> => {
    const tokenType = account === 'user' ? 'user_token' : 'store_token';

    try {
        const token = await AsyncStorage.getItem(tokenType);
        if (!token) return { isValid: false, needsRefresh: false };

        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        const currentTime = Date.now() / 1000;
        const bufferTime = 5 * 60; // 5 minutes

        if (typeof decodedToken.exp === 'number') {
            const isValid = decodedToken.exp > currentTime;
            const needsRefresh = decodedToken.exp < currentTime + bufferTime;
            return { isValid, needsRefresh };
        }

        return { isValid: false, needsRefresh: false };
    } catch {
        return { isValid: false, needsRefresh: false };
    }
};

// Export utility functions
export const isAuthenticated = async (account: 'user' | 'store' = 'user'): Promise<boolean> => {
    const { isValid } = await checkTokenStatus(account);
    return isValid;
};

export const needsTokenRefresh = async (): Promise<boolean> => {
    const { needsRefresh } = await checkTokenStatus();
    return needsRefresh;
};

export const clearAuthData = async (): Promise<void> => {
    await AsyncStorage.multiRemove(['store_token', 'refresh_token', 'user_data']);
};

// Default instance
export const api = axiosBaseQuery();