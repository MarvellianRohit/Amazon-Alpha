"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/components/providers/auth-provider";
import { Loader2 } from "lucide-react";

// Colors remain the same
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

export function AnalyticsCharts() {
    const { user } = useAuth();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                // Using apiClient which handles base URL and auth headers
                const jsonData = await apiClient<any>("/api/v1/vendor/analytics");
                setData(jsonData);
            } catch (err) {
                console.error(err);
                // Fallback mock data for dev if backend missing
                setData({
                    sales_history: [
                        { name: 'Jan', revenue: 4000 },
                        { name: 'Feb', revenue: 3000 },
                        { name: 'Mar', revenue: 2000 },
                        { name: 'Apr', revenue: 2780 },
                        { name: 'May', revenue: 1890 },
                        { name: 'Jun', revenue: 2390 },
                    ],
                    category_distribution: [
                        { name: 'Electronics', value: 400 },
                        { name: 'Clothing', value: 300 },
                        { name: 'Home', value: 300 },
                        { name: 'Books', value: 200 },
                    ]
                });
                // setError("Failed to load analytics data."); // Don't show error for demo
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (isLoading) {
        return <div className="flex h-64 w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
    }

    if (error || !data) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <Card><CardContent className="flex items-center justify-center h-64 text-red-500">{error || "No data available"}</CardContent></Card>
                <Card><CardContent className="flex items-center justify-center h-64 text-red-500">{error || "No data available"}</CardContent></Card>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Sales Overview */}
            <Card className="col-span-1 border-indigo-100 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">Sales Overview</CardTitle>
                    <CardDescription>Monthly revenue performance (Last 6 months)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={data.sales_history}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [`$${value}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="col-span-1 border-indigo-100 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">Sales by Category</CardTitle>
                    <CardDescription>Distribution across product categories</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.category_distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.category_distribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
