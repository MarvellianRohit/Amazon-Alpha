"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress"; // Removed: using internal SimpleProgress
import { Users, Timer, ArrowRight, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

// Fallback simple progress if shadcn not installed
function SimpleProgress({ value, className }: { value: number, className?: string }) {
    return (
        <div className={cn("h-2 bg-neutral-100 rounded-full overflow-hidden", className)}>
            <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${value}%` }} />
        </div>
    );
}

export function GroupBuyCard() {
    const [participants, setParticipants] = useState(87);
    const [target] = useState(100);
    const [milestoneMsg, setMilestoneMsg] = useState("");

    // Real WebSocket Connection
    useEffect(() => {
        const ws = new WebSocket("ws://127.0.0.1:8000/api/v1/group-buy/ws/squad_demo");

        ws.onopen = () => {
            console.log("Joined Squad Stream");
        };

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === "UPDATE") {
                setParticipants(data.count + 87); // Add base for demo visual
            }
            if (data.type === "MILESTONE") {
                setMilestoneMsg(data.message);
                // Trigger confetti or toast handled by parent usually
            }
        };

        return () => ws.close();
    }, []);

    // Fallback simulation removed in favor of real WS (or kept for visual backup if backend offline)
    // For this demo, we rely on WS messages.

    const progress = (participants / target) * 100;

    return (
        <div className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            {/* Banner */}
            <div className="bg-indigo-600 text-white text-xs font-bold text-center py-1 flex items-center justify-center gap-1">
                <Timer className="w-3 h-3" /> ENDS IN 04:23:12
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg mb-1">Apple Watch Ultra 2</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-indigo-600">$749</span>
                            <span className="text-sm text-gray-400 line-through">$799</span>
                        </div>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg font-bold text-xs text-center leading-tight">
                        SAVE<br />$50
                    </div>
                </div>

                {/* Progress Section */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="flex items-center gap-1 text-indigo-600"><Users className="w-3 h-3" /> {participants} Joined</span>
                        <span className="text-gray-400">Target: {target}</span>
                    </div>
                    <SimpleProgress value={progress} className="h-3 bg-neutral-100 dark:bg-neutral-800" />
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <Unlock className="w-3 h-3 text-green-500" />
                        {target - participants} more needed to unlock deal
                    </div>
                </div>

                <Button className="w-full bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-white group-hover:bg-indigo-600 transition-colors">
                    Join Group Buy <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>

            {/* Decorative Confetti on hover (CSS only) */}
            <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-indigo-600/20 rounded-2xl transition-all" />
        </div>
    );
}
