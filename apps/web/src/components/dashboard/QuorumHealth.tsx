"use client";

import { useState, useEffect } from "react";
import { Activity, Server, AlertTriangle, CheckCircle } from "lucide-react";

export function QuorumHealth() {
    const [status, setStatus] = useState<any>(null);

    useEffect(() => {
        const interval = setInterval(async () => {
            // Mock API call simulation
            // In real app: fetch('/api/v1/quorum/status')
            // Here we simulate the response structure for UI dev
            setStatus({
                leader: "Kolkata (asia-south1)",
                status: "HEALTHY",
                last_heartbeat_ago: 0.2,
                replication_lag: 45
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    if (!status) return <div>Loading Quorum Status...</div>;

    const isHealthy = status.status === "HEALTHY";

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Activity className="text-blue-500" />
                    Dual-Region Quorum
                </h3>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${isHealthy ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {status.status}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black rounded-lg border border-neutral-800">
                    <div className="text-xs text-neutral-500 flex items-center gap-1 mb-1">
                        <Server className="w-3 h-3" /> Primary Leader
                    </div>
                    <div className="font-mono text-sm">{status.leader}</div>
                </div>

                <div className="p-4 bg-black rounded-lg border border-neutral-800">
                    <div className="text-xs text-neutral-500 flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3 h-3" /> Replication Lag
                    </div>
                    <div className="font-mono text-sm">{status.replication_lag} ms</div>
                </div>
            </div>

            <div className="mt-4 text-[10px] text-neutral-600 font-mono text-center">
                TrueTime Uncertainty Window: 4ms | Paxos Consensus: v2
            </div>
        </div>
    );
}
