import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { emitAuthFailed } from "../utils/authEvents";

declare module "axios" {
    export interface AxiosRequestConfig {
        skipAuth?: boolean;
    }
}

// One source of truth for both the main instance and the refresh call
export const API_URL = "http://172.20.10.3:3000/api";

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

// Separate instance with NO interceptors, used only for refreshing
const refreshClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    if (config.skipAuth) return config;
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let refreshPromise: Promise<string> | null = null;


async function refreshAccessToken(): Promise<string> {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");

    const { data } = await refreshClient.post("/auth/refresh_token", { refreshToken });

    await SecureStore.setItemAsync("accessToken", data.accessToken);
    await SecureStore.setItemAsync("refreshToken", data.refreshToken);
    return data.accessToken as string;
}

/** Used by axios AND the socket. Concurrent callers share one refresh request. */
export function refreshSession(): Promise<string> {
    refreshPromise ??= (async () => {
        try {
            return await refreshAccessToken();
        } catch (e: any) {
            const status = e?.response?.status;
            const rejected = status === 401 || status === 403 || e?.message === "No refresh token";
            // Only log out when the server rejected the refresh token.
            // A network error must NOT log the user out.
            if (rejected) {
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                emitAuthFailed();
            }
            throw e;
        } finally {
            refreshPromise = null;
        }
    })();
    return refreshPromise;
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original: any = error.config;

        if (error.response?.status !== 401 || !original || original._retry || original.skipAuth) {
            return Promise.reject(error);
        }
        original._retry = true;

        try {
            const newToken = await refreshSession();
            original.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(original);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
);