import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosError,
} from "axios";
import * as SecureStore from "expo-secure-store";

declare module "axios" {
    export interface AxiosRequestConfig {
        skipAuth?: boolean;
    }
}


/**
 * ================================
 * Token helpers (single file)
 * ================================
 */

let accessTokenMemory: string | null = null;

const tokenService = {
    // Access token (memory only)
    getAccessToken: () => accessTokenMemory,
    setAccessToken: (token: string) => {
        accessTokenMemory = token;
    },
    clearAccessToken: () => {
        accessTokenMemory = null;
    },

    // Refresh token (secure storage)
    getRefreshToken: async () => {
        return SecureStore.getItemAsync("refreshToken");
    },
    setRefreshToken: async (token: string) => {
        await SecureStore.setItemAsync("refreshToken", token);
    },
    clearRefreshToken: async () => {
        await SecureStore.deleteItemAsync("refreshToken");
    },
};

/**
 * ================================
 * Axios instance
 * ================================
 */

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * ================================
 * Request interceptor
 * ================================
 */

axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (config.skipAuth) return config;


        const token = tokenService.getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * ================================
 * Refresh queue logic (CRITICAL)
 * ================================
 */

let isRefreshing = false;

let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token!);
        }
    });

    failedQueue = [];
};

/**
 * ================================
 * Response interceptor (401 handling)
 * ================================
 */

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // If refresh already happening → queue request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axiosInstance(originalRequest));
                    },
                    reject,
                });
            });
        }

        isRefreshing = true;

        try {
            const refreshToken = await tokenService.getRefreshToken();
            if (!refreshToken) {
                throw new Error("No refresh token");
            }

            // Call refresh endpoint
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh_token`,
                { refreshToken },
                { skipAuth: true }
            );

            const {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            } = response.data;

            // Save new tokens
            tokenService.setAccessToken(newAccessToken);
            await tokenService.setRefreshToken(newRefreshToken);

            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);

            // Hard logout
            tokenService.clearAccessToken();
            await tokenService.clearRefreshToken();

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

/**
 * ================================
 * Export token helpers (optional)
 * ================================
 */

export const authTokens = {
    setTokens: async (accessToken: string, refreshToken: string) => {
        tokenService.setAccessToken(accessToken);
        await tokenService.setRefreshToken(refreshToken);
    },
    clearTokens: async () => {
        tokenService.clearAccessToken();
        await tokenService.clearRefreshToken();
    },
};

