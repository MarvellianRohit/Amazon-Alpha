"use client";

import { useState, useEffect } from 'react';

const HISTORY_KEY = 'product_view_history';
const MAX_HISTORY = 5;

export function useViewHistory() {
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        // Load initial
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(HISTORY_KEY);
            if (saved) {
                setHistory(JSON.parse(saved));
            }
        }
    }, []);

    const addToHistory = (productId: string) => {
        setHistory(prev => {
            // Remove if exists to push to top
            const filtered = prev.filter(id => id !== productId);
            const newHistory = [productId, ...filtered].slice(0, MAX_HISTORY);

            if (typeof window !== 'undefined') {
                localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
            }
            return newHistory;
        });
    };

    return { history, addToHistory };
}
