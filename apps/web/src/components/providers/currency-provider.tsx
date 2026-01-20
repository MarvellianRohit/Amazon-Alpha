"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, SUPPORTED_CURRENCIES, formatPrice } from '@/lib/currencies';

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (code: CurrencyCode) => void;
    format: (amountInUsd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('user_currency') as CurrencyCode;
        if (saved && SUPPORTED_CURRENCIES.some(c => c.code === saved)) {
            setCurrencyState(saved);
        }
    }, []);

    const setCurrency = (code: CurrencyCode) => {
        setCurrencyState(code);
        localStorage.setItem('user_currency', code);
    };

    const format = (amountInUsd: number) => {
        return formatPrice(amountInUsd, currency);
    };

    // Always render provider to support SSR
    // During SSR, 'mounted' is false, but we still provide default context (USD)
    // to prevent useCurrency() from throwing errors in child components.
    // We can use 'mounted' to optionally prevent hydration mismatch if needed,
    // but for text content defined by currency, it's better to render default USD 
    // and let client hydrate/update.

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
