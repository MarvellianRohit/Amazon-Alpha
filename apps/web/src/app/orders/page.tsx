"use client"

import { useOrders } from "@/hooks/use-orders"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrackingMap } from "@/components/orders/tracking-map"
import { VerticalStepper, OrderStatus } from "@/components/orders/vertical-stepper"
import { generateInvoice } from "@/lib/invoice-generator"
import { Package, Download, MapPin } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Simple Badge component if not in Shadcn yet, or assume it is (we initialized shadcn default)
// If badge missing, I'll just use a span for now to avoid error, or install it.
// Actually `npx shadcn@latest add badge` wasn't run.
// I will use a simple span with classes.

export default function OrdersPage() {
    const { data: orders, isLoading } = useOrders()

    if (isLoading) return <div className="container py-10">Loading orders...</div>

    if (!orders || orders.length === 0) {
        return <div className="container py-10">No orders found.</div>
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
            <div className="space-y-4">
                {orders.map((order: any) => (
                    <Card key={order.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Order #{order.id.slice(0, 8)}
                            </CardTitle>
                            <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="capitalize">
                                {order.status}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${order.total_amount}</div>
                            <p className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString()}
                            </p>

                            <div className="mt-4 space-y-1">
                                {order.items?.map((item: any) => (
                                    <div key={item.id} className="text-sm text-gray-600">
                                        - Qty: {item.quantity} (Product ID: {item.product_id.slice(0, 8)}...)
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Track Package
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-3xl">
                                    <DialogHeader>
                                        <DialogTitle>Order Tracking</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="border rounded-xl overflow-hidden">
                                            <TrackingMap orderId={order.id} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Shipment Progress</h3>
                                            {/* Cast status or ensure strict typing in real app */}
                                            <VerticalStepper currentStatus={order.status as OrderStatus || 'Pending'} />
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Button variant="secondary" size="sm" onClick={() => generateInvoice(order)}>
                                <Download className="w-4 h-4 mr-2" />
                                Invoice
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
