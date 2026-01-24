"use client";

import { GroupBuyCard } from "@/components/marketing/GroupBuyCard";
import { Timer, Users, Flame } from "lucide-react";

export default function GroupDealsPage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            {/* Hero Section */}
            <div className="bg-indigo-600 text-white py-16 px-4 text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                    <Flame className="w-4 h-4 text-orange-300" /> HOTTEST DEALS
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Group Buy Madness</h1>
                <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                    Join forces with other shoppers to unlock exclusive volume discounts. The more people join, the lower the price goes!
                </p>
            </div>

            {/* Filters / Stats Bar */}
            <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-30">
                <div className="container mx-auto px-4 py-4 flex flex-wrap gap-6 items-center justify-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-2 text-sm font-bold">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            14 Active Deals
                        </span>
                    </div>
                    <div className="flex gap-4 text-sm text-neutral-500">
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 1,204 Shoppers Online</span>
                        <span className="flex items-center gap-1"><Timer className="w-4 h-4" /> Deals reset in 4h</span>
                    </div>
                </div>
            </div>

            {/* Deals Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Repeat the card to simulate a list of different products */}
                    <GroupBuyCard />
                    <GroupBuyCard />
                    <GroupBuyCard />
                    <GroupBuyCard />

                    <GroupBuyCard />
                    <GroupBuyCard />
                    <GroupBuyCard />
                    <GroupBuyCard />
                </div>
            </div>
        </div>
    );
}
