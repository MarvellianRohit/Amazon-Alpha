"use client";

import { Bot, User, RefreshCw, CheckCircle2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type AgentAction = {
    id: string;
    agent_type: "USER" | "NEGOTIATOR" | "VENDOR";
    action_type: string;
    description: string;
    timestamp: string;
    status: string;
};

export function AgentFeed({ actions }: { actions: AgentAction[] }) {
    if (actions.length === 0) return <div className="text-center text-neutral-500 py-10">System Idle. Waiting for intent...</div>;

    return (
        <div className="space-y-6 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-px before:bg-neutral-800">
            {actions.map((action) => (
                <div key={action.id} className="relative pl-16 group">
                    {/* Icon Marker */}
                    <div className={cn(
                        "absolute left-3 top-0 w-7 h-7 rounded-full border-4 border-black flex items-center justify-center z-10",
                        action.agent_type === "USER" ? "bg-blue-500" :
                            action.agent_type === "NEGOTIATOR" ? "bg-purple-500" : "bg-orange-500"
                    )}>
                        {action.agent_type === "USER" && <User className="w-3 h-3 text-white" />}
                        {action.agent_type === "NEGOTIATOR" && <Bot className="w-3 h-3 text-white" />}
                        {action.agent_type === "VENDOR" && <RefreshCw className="w-3 h-3 text-white" />}
                    </div>

                    {/* Content Bubble */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                            <span className={cn(
                                "text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                                action.agent_type === "USER" ? "text-blue-400 bg-blue-400/10" :
                                    action.agent_type === "NEGOTIATOR" ? "text-purple-400 bg-purple-400/10" : "text-orange-400 bg-orange-400/10"
                            )}>
                                {action.agent_type}
                            </span>
                            <span className="text-xs text-neutral-500">{new Date(action.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <h4 className="font-semibold text-neutral-200 mb-1">{action.description}</h4>

                        {action.status === "IN_PROGRESS" && (
                            <div className="flex items-center gap-2 text-xs text-yellow-500 mt-2">
                                <MoreHorizontal className="w-4 h-4 animate-pulse" /> Processing
                            </div>
                        )}
                        {action.status === "COMPLETED" && (
                            <div className="flex items-center gap-2 text-xs text-green-500 mt-2">
                                <CheckCircle2 className="w-4 h-4" /> Done
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
