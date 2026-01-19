"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";

export function CommissionTracker() {
    // Mock Data - In real app, fetch from get_admin_god_mode_stats RPC
    const totalCommission = 12540.50;
    const monthlyGrowth = 15.2;

    return (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Total Platform Revenue (Commissions)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-green-900">
                    ${totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-green-700 mt-1 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Confirmed Profit (+{monthlyGrowth}%)
                </p>
            </CardContent>
        </Card>
    );
}
