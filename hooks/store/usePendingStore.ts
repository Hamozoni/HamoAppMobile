import { create } from "zustand";

interface PendingStore {
    pendingLocation: {
        latitude: number;
        longitude: number;
        name?: string;
    } | null;
    setPendingLocation: (loc: PendingStore["pendingLocation"]) => void;
    clearPendingLocation: () => void;
}

export const usePendingStore = create<PendingStore>((set) => ({
    pendingLocation: null,
    setPendingLocation: (loc) => set({ pendingLocation: loc }),
    clearPendingLocation: () => set({ pendingLocation: null }),
}));