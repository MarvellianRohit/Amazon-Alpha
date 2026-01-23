"use client";

import { AccountSidebar } from "@/components/account/account-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RECENT_ORDERS } from "@/lib/mock-data";
import Image from "next/image";
import { PackageOpen } from "lucide-react";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Mocking a user ID of 1 for dev until Auth context is ready
                const data = await apiClient<any[]>('/api/orders?user_id=1');
                setOrders(data);
            } catch (err) {
                console.error("Failed to load orders", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <AccountSidebar />
                    <div className="flex-1 space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold">Order History</h1>
                            <p className="text-muted-foreground">View and track your past orders.</p>
                        </div>

                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <Card key={order.id}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <div className="space-y-1">
                                                <CardTitle className="text-sm font-medium">Order #{order.id}</CardTitle>
                                                <CardDescription>{new Date(order.created_at).toLocaleDateString()}</CardDescription>
                                            </div>
                                            <Badge className={order.status === 'Delivered' ? 'bg-green-500' : 'bg-blue-500'}>
                                                {order.status}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Note: Assuming Order items structure or simple total for now to match typical backend response */}
                                            <div className="flex justify-between items-center mt-6 pt-4 border-t">
                                                <Button variant="outline" size="sm">View Details</Button>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                                    <p className="font-bold text-lg">${order.total_amount}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                        <PackageOpen className="h-12 w-12 mb-4 opacity-50" />
                                        <p className="text-lg font-medium">No orders found</p>
                                        <p>You haven't placed any orders yet.</p>
                                        <Button className="mt-4" variant="outline">Start Shopping</Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
