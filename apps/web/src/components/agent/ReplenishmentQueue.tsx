"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Ban, CalendarClock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface QueueItem {
    id: string;
    product_name: string;
    price: number;
    predicted_date: string;
    confidence: number;
    auto_order: boolean;
}

export function ReplenishmentQueue() {
    const [items, setItems] = useState<QueueItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch or real API call
        // In real app: fetch('/api/v1/agents/replenishment/queue')
        const fetchQueue = async () => {
            try {
                // Simulating API delay
                setTimeout(() => {
                    setItems([
                        {
                            id: "pat_1",
                            product_name: "Organic Oat Milk",
                            price: 4.99,
                            predicted_date: new Date(Date.now() + 2 * 86400000).toISOString(),
                            confidence: 0.92,
                            auto_order: true
                        },
                        {
                            id: "pat_2",
                            product_name: "Toilet Paper (12 pk)",
                            price: 18.50,
                            predicted_date: new Date(Date.now() + 5 * 86400000).toISOString(),
                            confidence: 0.85,
                            auto_order: true
                        },
                        {
                            id: "pat_3",
                            product_name: "Espresso Beans (1kg)",
                            price: 32.00,
                            predicted_date: new Date(Date.now() + 6 * 86400000).toISOString(),
                            confidence: 0.88,
                            auto_order: false
                        }
                    ]);
                    setLoading(false);
                }, 1000);
            } catch (e) {
                console.error(e);
            }
        };
        fetchQueue();
    }, []);

    const handlePostpone = (id: string) => {
        toast.info("Postponed", { description: "Order delayed by 7 days." });
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, predicted_date: new Date(new Date(item.predicted_date).getTime() + 7 * 86400000).toISOString() } : item
        ));
    };

    const handleCancel = (id: string) => {
        toast.success("Cancelled", { description: "Item removed from queue." });
        setItems(prev => prev.filter(item => item.id !== id));
    };

    if (loading) return <div className="p-4 text-center text-neutral-500">Loading AI Predictions...</div>;

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-indigo-500" />
                Coming Soon (Next 7 Days)
            </h3>

            <div className="grid gap-3">
                {items.map((item, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={item.id}
                        className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{item.product_name}</span>
                                {item.auto_order ? (
                                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                                        <Zap className="w-3 h-3" /> AP2 AUTO
                                    </span>
                                ) : (
                                    <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-bold">
                                        REQUIRES APPROVAL
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-neutral-500 flex items-center gap-2">
                                <span>Est. {new Date(item.predicted_date).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>${item.price.toFixed(2)}</span>
                                <span>•</span>
                                <span>{Math.round(item.confidence * 100)}% Confidence</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePostpone(item.id)}
                                className="flex-1 sm:flex-none text-xs h-8"
                            >
                                <Clock className="w-3 h-3 mr-1.5" /> Postpone
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCancel(item.id)}
                                className="flex-1 sm:flex-none text-xs h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <Ban className="w-3 h-3 mr-1.5" /> Cancel
                            </Button>
                        </div>
                    </motion.div>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-8 text-neutral-500 text-sm">
                        No upcoming predicted orders.
                    </div>
                )}
            </div>
        </div>
    );
}
