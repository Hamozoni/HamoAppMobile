// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Global settings for all queries
            retry: 2, // Retry failed requests once
            refetchOnWindowFocus: false, // Useful in mobile apps to prevent refetch on screen focus
            staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
        },
        mutations: {
            retry: 2,
        },
    },
});

