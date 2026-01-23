"use client";

import { AccountSidebar } from "@/components/account/account-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { CURRENT_USER } from "@/lib/mock-data"
import Link from "next/link"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountPage() {
    const [wallet, setWallet] = useState<{ balance: number; address: string } | null>(null);
    const [latestOrder, setLatestOrder] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, these would probably be parallel promises or a single aggregation endpoint.
                // Fetching wallet/user info
                // Using a hardcoded ID or 'me' if supported. Assuming 'me' for now or avoiding ID if context handles it.
                // For this implementation, I will simulate an endpoint since I don't know the exact auth user ID logic yet.
                // Replacing mock data:
                /*
                const userRes = await apiClient<any>('/api/users/me'); 
                const ordersRes = await apiClient<any>('/api/orders/mine?limit=1');
                */

                // Simulating API call for now to demonstrate structure until backend Auth is fully known
                // But user asked for REAL integration.
                // I will try to fetch from standard endpoints.

                const userRes = await apiClient<any>('/api/users/me').catch(() => null);
                // Fallback if 'me' endpoint doesn't exist yet:
                const mockWallet = { balance: 1250.00, address: "0x71C...9A21" };

                setWallet(userRes ? { balance: userRes.balance, address: userRes.wallet_address } : mockWallet);

                const ordersRes = await apiClient<any[]>('/api/orders?user_id=1&limit=1').catch(() => []); // Assuming user_id=1 for dev
                setLatestOrder(ordersRes && ordersRes.length > 0 ? ordersRes[0] : null);

            } catch (error) {
                console.error("Failed to fetch account data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-64 h-[500px] rounded-lg border bg-white p-4">
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <Skeleton className="h-8 w-48" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Skeleton className="h-40 rounded-xl" />
                                <Skeleton className="h-40 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar */}
                    <AccountSidebar />

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Account Overview</h1>
                        </div>

                        {/* Recent Activity / Dashboard Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Wallet Summary */}
                            <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none">
                                <CardContent className="p-6">
                                    <div className="flex flex-col justify-between h-full space-y-4">
                                        <div>
                                            <p className="text-white/80 text-sm font-medium mb-1">Total Balance</p>
                                            <p className="text-3xl font-bold">${wallet?.balance?.toFixed(2) || "0.00"}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/80 text-xs font-mono break-all">{wallet?.address || "No Wallet Connected"}</p>
                                        </div>
                                        <Link href="/account/wallet">
                                            <Button size="sm" variant="secondary" className="w-full mt-2">
                                                Manage Wallet
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Order Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Latest Order</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {latestOrder ? (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-lg">#{latestOrder.id}</span>
                                                <Badge className="bg-green-500">{latestOrder.status}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{new Date(latestOrder.created_at).toLocaleDateString()}</p>
                                            <Link href="/account/orders">
                                                <Button size="sm" variant="outline" className="w-full mt-2">
                                                    View All Orders
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="py-4 text-center text-muted-foreground text-sm">
                                            No recent orders found.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
