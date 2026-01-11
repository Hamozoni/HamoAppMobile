// src/lib/axios.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store'; // For securely storing the JWT

// Create an Axios instance with a base URL
export const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL, // Your backend base URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach the JWT token to every request
axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const token = await SecureStore.getItemAsync('user_token'); // Retrieve token
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Failed to retrieve auth token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Response Interceptor for global error handling (e.g., token refresh)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Example: Auto-refresh token on 401 error
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Implement your token refresh logic here
            // const newToken = await refreshToken();
            // await SecureStore.setItemAsync('user_token', newToken);
            // originalRequest.headers.Authorization = `Bearer ${newToken}`;
            // return axiosInstance(originalRequest);
        }
        return Promise.reject(error);
    }
);