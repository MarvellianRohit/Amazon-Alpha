'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data simulating 10% fee impact
const data = [
    { name: "Jan", gross: 1200, net: 1080 },
    { name: "Feb", gross: 2100, net: 1890 },
    { name: "Mar", gross: 1800, net: 1620 },
    { name: "Apr", gross: 2400, net: 2160 },
    { name: "May", gross: 2800, net: 2520 },
    { name: "Jun", gross: 3200, net: 2880 },
    { name: "Jul", gross: 3500, net: 3150 },
];

export function PayoutChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Gross Sales vs Net Profit</CardTitle>
                <CardDescription>
                    Comparing total sales against actual payout (after 10% platform fee).
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                        <Bar
                            dataKey="gross"
                            name="Gross Sales"
                            fill="#adfa1d" // Bright green/lime
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="net"
                            name="Net Profit"
                            fill="#2563eb" // Blue
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
