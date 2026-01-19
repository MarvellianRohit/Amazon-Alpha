'use client';

import { PayoutChart } from "@/components/vendor/payout-chart";
import { StatCard } from "@/components/vendor/stat-card";
import { DollarSign, Wallet } from "lucide-react";

export default function PayoutsPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Payouts & Earnings</h2>
                <div className="flex items-center space-x-2">
                    {/* Future: Request Payout Button */}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <StatCard
                    title="Gross Sales"
                    value="$17,000.00"
                    description="Total value of items sold"
                    icon={DollarSign}
                />
                <StatCard
                    title="Net Profit"
                    value="$15,300.00"
                    description="Earnings after 10% platform fee"
                    icon={Wallet}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-1">
                <PayoutChart />
            </div>
        </div>
    );
}
