"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface WalletContextType {
    address: string | null
    isConnected: boolean
    balance: string
    connect: () => Promise<void>
    disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [address, setAddress] = useState<string | null>(null)
    const [balance, setBalance] = useState<string>("0.00")
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const initWallet = async () => {
            // 1. Try local storage first for immediate UI feedback
            const savedAddress = localStorage.getItem("wallet_address")
            if (savedAddress) {
                setAddress(savedAddress)
                setBalance("4.20")
            }

            // 2. Fetch from Backend (Source of Truth)
            /* 
            try {
                const res = await fetch("http://127.0.0.1:8000/api/v1/users/me")
                if (res.ok) {
                    const data = await res.json()
                    if (data.wallet_address) {
                        setAddress(data.wallet_address)
                        localStorage.setItem("wallet_address", data.wallet_address)
                        setBalance("4.20")
                    }
                }
            } catch (e) {
                console.error("Failed to sync wallet with backend", e)
            }
            */
        }
        initWallet()
    }, [])

    const connect = async () => {
        // Simulate a delay for "connecting"
        await new Promise(resolve => setTimeout(resolve, 800))
        const mockAddress = "0x71C...9A23"

        // Update State
        setAddress(mockAddress)
        setBalance("4.20")
        localStorage.setItem("wallet_address", mockAddress)

        // Persist to Backend
        try {
            await fetch("http://127.0.0.1:8000/api/v1/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallet_address: mockAddress })
            })
        } catch (e) {
            console.error("Failed to persist wallet address", e)
        }
    }

    const disconnect = async () => {
        setAddress(null)
        setBalance("0.00")
        localStorage.removeItem("wallet_address")

        // Clear from Backend
        try {
            await fetch("http://127.0.0.1:8000/api/v1/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallet_address: null })
            })
        } catch (e) {
            console.error("Failed to clear wallet address on backend", e)
        }
    }

    // Always render provider to support SSR
    // During SSR, 'mounted' is false, but we still provide default context
    // just like we did in CurrencyProvider.

    return (
        <WalletContext.Provider value={{ address, isConnected: !!address, balance, connect, disconnect }}>
            {children}
        </WalletContext.Provider>
    )
}

export const useWallet = () => {
    const context = useContext(WalletContext)
    if (context === undefined) {
        throw new Error("useWallet must be used within a WalletProvider")
    }
    return context
}
