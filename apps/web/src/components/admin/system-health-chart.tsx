"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

// Generate initial mock data
const generateData = () => {
    return Array.from({ length: 20 }, (_, i) => ({
        time: i,
        latency: 40 + Math.random() * 30, // 40-70ms
        load: 20 + Math.random() * 40, // 20-60%
    }));
};

export function SystemHealthChart() {
    const [data, setData] = useState(generateData());

    // Simulate live updates
    useEffect(() => {
        const interval = setInterval(() => {
            setData(currentData => {
                const newData = [...currentData.slice(1)];
                const lastTime = newData[newData.length - 1].time;
                newData.push({
                    time: lastTime + 1,
                    latency: 40 + Math.random() * 50 + (Math.random() > 0.9 ? 100 : 0), // Occasional spike
                    load: 30 + Math.random() * 20,
                });
                return newData;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const latestLatency = Math.round(data[data.length - 1].latency);
    const statusColor = latestLatency > 150 ? "text-red-500" : latestLatency > 100 ? "text-yellow-500" : "text-green-500";

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    System Health & Latency
                </CardTitle>
                <Activity className={`h-4 w-4 ${statusColor}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold mb-4">{latestLatency}ms <span className="text-xs text-muted-foreground font-normal">avg response</span></div>
                <div className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" hide />
                            <YAxis hide domain={[0, 300]} />
                            <Tooltip
                                contentStyle={{ background: '#333', border: 'none', borderRadius: '4px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{ display: 'none' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="latency"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorLatency)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
