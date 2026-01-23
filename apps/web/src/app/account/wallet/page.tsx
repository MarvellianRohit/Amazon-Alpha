"use client";

import { AccountSidebar } from "@/components/account/account-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CURRENT_USER } from "@/lib/mock-data";
import { ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, ExternalLink, Package } from "lucide-react";

export default function WalletPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <AccountSidebar />
                    <div className="flex-1 space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold">My Wallet</h1>
                            <p className="text-muted-foreground">Manage your balance and payment methods.</p>
                        </div>

                        {/* Balance Card */}
                        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <CardContent className="p-8 relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="space-y-1">
                                        <p className="text-purple-100 font-medium">Total Balance</p>
                                        <h2 className="text-4xl font-bold">{CURRENT_USER.balance}</h2>
                                        <div className="flex items-center gap-2 mt-2 bg-white/10 w-fit px-3 py-1 rounded-full text-xs font-mono">
                                            <Wallet className="w-3 h-3" />
                                            {CURRENT_USER.walletAddress}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="secondary" className="gap-2">
                                            <ArrowDownLeft className="w-4 h-4" /> Deposit
                                        </Button>
                                        <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white gap-2">
                                            <ArrowUpRight className="w-4 h-4" /> Withdraw
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Payment Methods */}
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Payment Methods</CardTitle>
                                    <CardDescription>Saved cards and accounts.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-900">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-6 bg-slate-300 rounded overflow-hidden relative">
                                                {/* Mock Visa Icon */}
                                                <div className="w-full h-full bg-[#1A1F71]"></div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Visa ending in 4242</p>
                                                <p className="text-xs text-muted-foreground">Expires 12/28</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline">Default</Badge>
                                    </div>
                                    <Button variant="outline" className="w-full border-dashed gap-2">
                                        <CreditCard className="w-4 h-4" /> Add Payment Method
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Digital Assets Preview */}
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Digital Assets</CardTitle>
                                    <CardDescription>Your NFTs and tokens.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">Sony WH-1000XM5</p>
                                            <p className="text-xs text-muted-foreground">Digital Twin #4920</p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Transaction History (Placeholder) */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Transactions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground text-center py-8">No recent transactions to show.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
