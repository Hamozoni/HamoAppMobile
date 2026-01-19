import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosError,
} from "axios";
import tokenService from "../services/tokenService";

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
 * Refresh queue logic (prevents thundering herd)
 * ================================
 */

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

/**
 * ================================
 * Response interceptor (401 handling)
 * ================================
 */

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // Only handle 401 errors
        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        // Prevent infinite retry loops
        if (originalRequest._retry) {
            // Clear tokens and redirect to login
            tokenService.clearAccessToken();
            await tokenService.clearRefreshToken();


            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // If refresh already in progress, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axiosInstance(originalRequest));
                    },
                    reject: (error) => {
                        reject(error);
                    },
                });
            });
        }

        isRefreshing = true;

        try {
            // Get tokens from secure storage
            const refreshToken = tokenService.getRefreshToken();

            console.log(refreshToken);

            if (!refreshToken) {
                throw new Error("Missing refresh token");
            }

            // Call refresh endpoint
            const { data } = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh_token`,
                {
                    refreshToken
                },
                {
                    timeout: 5000,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log(data);

            // Validate response
            if (!data.accessToken || !data.refreshToken) {
                throw new Error("Invalid refresh response");
            }

            // Save new tokens
            tokenService.setAccessToken(data.accessToken);
            await tokenService.setRefreshToken(data.refreshToken);

            lastRefreshAttempt = Date.now();

            // Process queued requests with new token
            processQueue(null, data.accessToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return axiosInstance(originalRequest);
        } catch (refreshError: any) {
            console.error("Token refresh failed:", refreshError.message);

            // If refresh endpoint returns 401, tokens are invalid
            if (refreshError.response?.status === 401) {
                console.warn("Refresh token invalid or expired");
            }

            // Clear tokens and process queue with error
            tokenService.clearAccessToken();
            await tokenService.clearRefreshToken();

            processQueue(refreshError, null);

            // Redirect to login

            // navigateToLogin();

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

export const authTokens = {
    /**
     * Store both access and refresh tokens
     */
    setTokens: async (accessToken: string, refreshToken: string) => {
        tokenService.setAccessToken(accessToken);
        await tokenService.setRefreshToken(refreshToken);
    },

    /**
     * Clear both tokens and redirect to login
     */
    clearTokens: async () => {
        tokenService.clearAccessToken();
        await tokenService.clearRefreshToken();
        // navigateToLogin();
    },

    /**
     * Get current access token (for manual API calls if needed)
     */
    getAccessToken: () => tokenService.getAccessToken(),
};

