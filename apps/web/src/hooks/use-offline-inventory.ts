"use client";

import { useState, useEffect } from "react";

// Mock IDB Wrapper
const idb = {
    get: async (key: string) => 0,
    set: async (key: string, val: any) => { },
};

export function useOfflineInventory(sku: string) {
    const [localStock, setLocalStock] = useState(0);
    const [pendingOps, setPendingOps] = useState(0);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsOnline(navigator.onLine);
            window.addEventListener('online', () => setIsOnline(true));
            window.addEventListener('offline', () => setIsOnline(false));
        }
    }, []);

    const buyOffline = async (qty: number) => {
        // Optimistic Update
        setLocalStock(prev => prev - qty);
        setPendingOps(prev => prev + qty);

        // Save to IndexedDB
        await idb.set(`pending_opts_${sku}`, pendingOps + qty);

        console.log(`[Offline] Decr stored locally. Pending: ${pendingOps + qty}`);

        if (isOnline) {
            sync();
        }
    };

    const sync = async () => {
        console.log("[Sync] Merging CRDT State with Server...");
        // Mock API Call
        // await fetch('/api/v1/sync', { ... })
        setPendingOps(0);
    };

    return { localStock, isOnline, buyOffline };
}
