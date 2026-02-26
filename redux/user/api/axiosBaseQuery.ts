import toaster from "@/config/toaster";
import LocationManager from "@/hooks/useCoordinates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { jsonHeader } from "./setAuthHeaders";
import { server } from "@/config/server";


// Define error types for better type safety
export enum ErrorType {
    NETWORK_ERROR = "NETWORK_ERROR",
    SERVER_ERROR = "SERVER_ERROR",
    AUTH_ERROR = "AUTH_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    TIMEOUT_ERROR = "TIMEOUT_ERROR",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

type AxiosBaseQueryArgs = {
    url: string;
    method: AxiosRequestConfig["method"];
    data?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
    headers?: AxiosRequestConfig["headers"];
    authType?: "store" | "user";
    skipErrorHandling?: boolean; // Allow components to handle their own errors
    retryCount?: number; // For automatic retries
};

interface CustomError {
    status: number | string;
    data: any;
    errorType: ErrorType;
    isServerDown?: boolean;
    shouldRetry?: boolean;
}

interface ErrorHandlerConfig {
    showToast?: boolean;
    navigate?: boolean;
    customMessage?: string;
}

interface ApiResponse {
    type: "success" | "error";
    message: string;
    accessToken?: any;
    data?: any | ApiResponse;
    to?: string;
}

// let server = "https://corislo-backend.onrender.com";


// if (process.env.NODE_ENV === "development") {
//     }


// Enhanced navigation helper
const navigateToErrorPage = async (errorType: ErrorType) => {
    switch (errorType) {
        case ErrorType.NETWORK_ERROR:
            router.push({
                pathname: "/broken",
                params: { errorType: "network" },
            });

            break;
        case ErrorType.SERVER_ERROR:
            router.push({
                pathname: "/broken",
                params: { errorType: "server" },
            });
            break;
        case ErrorType.AUTH_ERROR:
            // Clear auth data and
            await AsyncStorage.multiRemove(["user_token", "refresh_token"]);
            router.push("/user/auth/Login");
            break;

        default:
            return;
    }
};

// Check network connectivity
const checkNetworkConnectivity = async (): Promise<boolean> => {
    try {
        const netInfo = await NetInfo.fetch();
        return netInfo.isConnected ?? false;
    } catch {
        return true; // Assume connected if check fails
    }
};

// Enhanced error categorization
const categorizeError = async (
    err: AxiosError
): Promise<{ errorType: ErrorType; shouldRetry: boolean }> => {
    // Network/connectivity errors
    if (!err.response) {
        const networkErrorCodes = [
            "NETWORK_ERROR",
            "ECONNREFUSED",
            "ENOTFOUND",
            "ECONNABORTED",
        ];
        const isNetworkError =
            networkErrorCodes.includes(err.code || "") ||
            err.message.includes("Network Error");

        if (isNetworkError || err.code === "ECONNABORTED") {
            return {
                errorType:
                    err.code === "ECONNABORTED"
                        ? ErrorType.TIMEOUT_ERROR
                        : ErrorType.NETWORK_ERROR,
                shouldRetry: true,
            };
        }
    }

    const status = err.response?.status;

    // Server errors (5xx)
    if (status && status === 500) {
        return { errorType: ErrorType.SERVER_ERROR, shouldRetry: true };
    }

    // Auth errors (401, 403)
    const authStatus = await isAuthenticated();
    if (!authStatus) {
        return { errorType: ErrorType.AUTH_ERROR, shouldRetry: false };
    }

    // Validation errors (400, 422)
    if (status === 422) {
        return { errorType: ErrorType.VALIDATION_ERROR, shouldRetry: false };
    }

    return { errorType: ErrorType.UNKNOWN_ERROR, shouldRetry: false };
};

// Enhanced error message generation
const getErrorMessage = (errorType: ErrorType, errorData?: any): string => {
    switch (errorType) {
        case ErrorType.NETWORK_ERROR:
            return "Unable to connect to server. Please check your internet connection.";
        case ErrorType.SERVER_ERROR:
            return "Server is experiencing issues. Please try again later.";

        case ErrorType.TIMEOUT_ERROR:
            return "Request timed out. Please try again.";
        case ErrorType.VALIDATION_ERROR:
            return (
                errorData?.message || "Please check your input and try again."
            );
        default:
            return (
                errorData?.message || "Something went wrong. Please try again."
            );
    }
};

// Enhanced error handler
const handleError = async (
    customError: CustomError,
    config: ErrorHandlerConfig = {}
) => {
    const { showToast = true, navigate = true, customMessage } = config;

    // Check network connectivity for network errors
    if (customError.errorType === ErrorType.NETWORK_ERROR) {
        const isConnected = await checkNetworkConnectivity();
        if (!isConnected) {
            if (showToast) {
                toaster({
                    type: "error",
                    message:
                        "No internet connection. Please check your network settings.",
                });
            }
            if (navigate) navigateToErrorPage(ErrorType.NETWORK_ERROR);
            return;
        }
    }

    // Show toast notification
    if (showToast) {
        const message =
            customMessage ||
            getErrorMessage(customError.errorType, customError.data);
        toaster({
            type: "error",
            message,
        });
    }

    // Handle navigation
    if (navigate) {
        navigateToErrorPage(customError.errorType);
    }
};

// Retry mechanism
const retryRequest = async (
    requestFn: () => Promise<any>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<any> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await requestFn();
        } catch (error) {
            if (attempt === maxRetries) throw error;
            await new Promise((resolve) =>
                setTimeout(resolve, delay * attempt)
            );
        }
    }
};

export const axiosBaseQuery =
    (
        defaultConfig: ErrorHandlerConfig = {}
    ): BaseQueryFn<AxiosBaseQueryArgs, ApiResponse, CustomError> =>
        async ({
            url,
            method,
            data,
            params,
            headers,
            authType = "store",
            skipErrorHandling = false,
            retryCount = 0,
        }) => {
            const locationManager = new LocationManager()
            const currentLocation = locationManager.getCurrentLocation();
            console.log("currentLocation ====>", currentLocation)

            const makeRequest = async () => {
                const authHeaders = authType ? await jsonHeader() : { headers: {} };
                const mergedHeaders = {
                    ...(headers ?? {}),
                    ...(authHeaders?.headers ?? {}),
                    'x-latitude': currentLocation?.latitude?.toString(),
                    'x-longitude': currentLocation?.longitude?.toString()

                };
                console.log(`${server}/api/v1${url}`)
                const res = await axios({
                    url: `${server}/api/v1${url}`,
                    method,
                    data,
                    params,
                    headers: mergedHeaders,
                    timeout: 10000,
                });
                const { type, message } = res.data || {};
                if (type === "success" && message !== "success") {
                    toaster({ type, message });
                }
                return res;
            };

            try {
                let result;

                if (retryCount > 0) {
                    result = await retryRequest(makeRequest, retryCount + 1);
                } else {
                    result = await makeRequest();
                }

                return { data: result.data };
            } catch (axiosError) {
                const err = axiosError as AxiosError;
                const { errorType, shouldRetry } = await categorizeError(err);

                const customError: CustomError = {
                    status: err.response?.status || errorType,
                    data:
                        err.response?.data &&
                            (err.response.data as any).data !== undefined
                            ? (err.response.data as any).data
                            : err.response?.data || {
                                message: err.message,
                                errorType,
                            },
                    errorType,
                    isServerDown:
                        errorType === ErrorType.NETWORK_ERROR ||
                        errorType === ErrorType.SERVER_ERROR,
                    shouldRetry,
                };

                // Handle error if not skipped
                if (!skipErrorHandling) {
                    await handleError(customError, defaultConfig);
                }

                return { error: customError };
            }
        };

// Enhanced token management
const checkTokenStatus = async (): Promise<{
    isValid: boolean;
    needsRefresh: boolean;
}> => {
    try {
        const getLocalToken = await AsyncStorage.getItem("user_token");
        if (!getLocalToken) {
            return { isValid: false, needsRefresh: false };
        }

        const decodedToken = jwtDecode(getLocalToken);
        const currentTime = Date.now() / 1000;
        const bufferTime = 5 * 60; // 5 minutes buffer

        if (typeof decodedToken.exp === "number") {
            const isValid = decodedToken.exp > currentTime;
            const needsRefresh = decodedToken.exp < currentTime + bufferTime;
            return { isValid, needsRefresh };
        }

        return { isValid: false, needsRefresh: false };
    } catch (error) {
        return { isValid: false, needsRefresh: false };
    }
};

export const isAuthenticated = async (): Promise<boolean> => {
    const { isValid } = await checkTokenStatus();
    return isValid;
};

export const needsTokenRefresh = async (): Promise<boolean> => {
    const { needsRefresh } = await checkTokenStatus();
    return needsRefresh;
};

export const isOffline = async (): Promise<boolean> => {
    const authenticated = await isAuthenticated();
    return !authenticated;
};

// Utility for clearing auth data
export const clearAuthData = async () => {
    try {
        await AsyncStorage.multiRemove([
            "user_token",
            "refresh_token",
            "user_data",
        ]);
    } catch (error) {
    }
};
