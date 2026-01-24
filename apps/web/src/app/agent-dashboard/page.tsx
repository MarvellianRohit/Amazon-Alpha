"use client";

import { useState, useEffect } from "react";
import { CommandCenter } from "@/components/agent/CommandCenter";
import { AgentFeed } from "@/components/agent/AgentFeed";
import { ReplenishmentQueue } from "@/components/agent/ReplenishmentQueue";
import { Zap, PackageCheck } from "lucide-react";

export default function AgentDashboard() {
    const [actions, setActions] = useState<any[]>([]);
    const [replenishment, setReplenishment] = useState<any[]>([]);

    // Mock initial load
    useEffect(() => {
        // Simulate polling
        const mockActions = [
            {
                id: '1', agent_type: 'USER', action_type: 'REPLENISH_CHECK',
                description: 'Scanning weekly consumption habits...',
                timestamp: new Date().toISOString(), status: 'COMPLETED'
            }
        ];
        setActions(mockActions);

        const mockReplenish = [
            { name: "Organic Oat Milk", date: "Tomorrow", prob: "92%" },
            { name: "Printer Paper", date: "In 3 days", prob: "85%" }
        ];
        setReplenishment(mockReplenish);
    }, []);

    const handleCommand = (cmd: string) => {
        // Optimistic update
        const newAction = {
            id: Math.random().toString(),
            agent_type: 'USER',
            action_type: 'SEARCH',
            description: `Analyzing intent: "${cmd}"`,
            timestamp: new Date().toISOString(),
            status: 'IN_PROGRESS'
        };

        setActions(prev => [newAction, ...prev]);

        // Simulate System Response
        setTimeout(() => {
            setActions(prev => [{
                id: Math.random().toString(),
                agent_type: 'NEGOTIATOR',
                action_type: 'NEGOTIATE',
                description: 'Contacting 3 verified vendors for quotes...',
                timestamp: new Date().toISOString(),
                status: 'IN_PROGRESS'
            }, ...prev]);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Ambient Bg */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />

            <div className="container mx-auto max-w-6xl px-4 py-8 relative z-10">

                <header className="mb-12 text-center">
                    <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                        Agent Oversight Protocol
                    </h1>
                    <p className="text-neutral-500">Autonomous Commerce System v2.0</p>
                </header>

                {/* Command Center */}
                <div className="mb-16">
                    <CommandCenter onCommand={handleCommand} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            Live Activity Stream
                        </h3>
                        <AgentFeed actions={actions} />
                    </div>

                    {/* Right Sidebar: Predictions */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <PackageCheck className="w-5 h-5 text-blue-500" />
                            Zero-Click Replenishment
                        </h3>

                        <div className="space-y-4">
                            {replenishment.map((item, i) => (
                                <div key={i} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold">{item.name}</div>
                                        <div className="text-xs text-neutral-500">Predicted: {item.date}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-green-400 font-bold text-sm">{item.prob}</div>
                                        <div className="text-[10px] text-neutral-600 uppercase">Confidence</div>
                                    </div>
                                </div>
                            ))}
                            <div className="p-4 rounded-xl border border-dashed border-neutral-800 text-center text-sm text-neutral-500">
                                System analyzing purchase history...
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
