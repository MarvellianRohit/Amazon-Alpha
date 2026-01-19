"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { BarChart3 } from "lucide-react";

const DATA = [
    { month: "Jan", sales: 4000, market: 2400 },
    { month: "Feb", sales: 3000, market: 1398 },
    { month: "Mar", sales: 2000, market: 9800 },
    { month: "Apr", sales: 2780, market: 3908 },
    { month: "May", sales: 1890, market: 4800 },
    { month: "Jun", sales: 2390, market: 3800 },
    { month: "Jul", sales: 3490, market: 4300 },
];

export function ComparisonChart() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    Performance vs Market
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#f3f4f6" }}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="sales" name="Your Sales" stroke="#2563eb" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                            <Area type="monotone" dataKey="market" name="Market Avg" stroke="#94a3b8" fillOpacity={1} fill="url(#colorMarket)" strokeDasharray="4 4" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
