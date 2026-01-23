import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosError,
} from "axios";

import * as SecureStore from "expo-secure-store";
import { emitAuthFailed } from "../utils/authEvents";

declare module "axios" {
    export interface AxiosRequestConfig {
        skipAuth?: boolean;
    }
}

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


axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (config.skipAuth) return config;

        const token = await SecureStore.getItemAsync("accessToken");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


let isRefreshing = false;
let lastRefreshAttempt = 0;

interface QueueItem {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}

let failedQueue: QueueItem[] = [];

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

        if (Date.now() - lastRefreshAttempt < 3000) {
            return Promise.reject(error);
        }
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
            const refreshToken = await SecureStore.getItemAsync("refreshToken");
            if (!refreshToken) throw new Error("Missing refresh token");

            const { data } = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh_token`,
                { refreshToken }
            );

            await SecureStore.setItemAsync("accessToken", data.accessToken);
            await SecureStore.setItemAsync("refreshToken", data.refreshToken);

            lastRefreshAttempt = Date.now();

            processQueue(null, data.accessToken);

            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return axiosInstance(originalRequest);

        } catch (refreshError) {
            isRefreshing = false;
            processQueue(refreshError, null);
            emitAuthFailed();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);


/**
 * ================================
 * Token helpers
 * ================================
 */

// export const authTokens = {
//     /**
//      * Store both access and refresh tokens
//      */
//     setTokens: async (accessToken: string, refreshToken: string) => {
//         tokenService.setAccessToken(accessToken);
//         await tokenService.setRefreshToken(refreshToken);
//     },

//     /**
//      * Clear both tokens and redirect to login
//      */
//     clearTokens: async () => {
//         tokenService.clearAccessToken();
//         await tokenService.clearRefreshToken();
//         // navigateToLogin();
//     },

//     /**
//      * Get current access token (for manual API calls if needed)
//      */
//     getAccessToken: () => tokenService.getAccessToken(),
// };

