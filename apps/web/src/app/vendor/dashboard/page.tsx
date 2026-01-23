
"use client" // For recharts

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, DollarSign, Users, TrendingUp, Plus, ShieldCheck, ExternalLink } from "lucide-react"
import { RECENT_ORDERS, PRODUCTS } from "@/lib/mock-data"
import { AnalyticsCharts } from "@/components/vendor/analytics-charts"



export default function VendorDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="container mx-auto max-w-6xl space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Vendor Portal</h1>
                        <p className="text-muted-foreground">Manage your products, orders, and earnings.</p>
                    </div>
                    <div className="flex space-x-2">
                        <Link href="/vendor/add-product">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Product
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,231.89</div>
                            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{PRODUCTS.length}</div>
                            <p className="text-xs text-muted-foreground">2 low stock alerts</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sales</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12,234</div>
                            <p className="text-xs text-muted-foreground">+19% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Followers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">573</div>
                            <p className="text-xs text-muted-foreground">+201 since last week</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Dynamic Analytics Charts */}
                <AnalyticsCharts />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-7">
                        <CardHeader>
                            <CardTitle>Top Products</CardTitle>
                            <CardDescription>Your best performing items this month.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {PRODUCTS.slice(0, 4).map((product) => (
                                    <div key={product.id} className="flex items-center">
                                        <div className="space-y-1 flex-1">
                                            <p className="text-sm font-medium leading-none">{product.name}</p>
                                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                                ${product.price}
                                                {product.isDigitalTwin && (
                                                    <span className="ml-2 flex items-center text-green-600">
                                                        <ShieldCheck className="h-3 w-3 mr-0.5" /> Verified
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="font-medium text-sm">
                                            {product.reviews} Sales
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {RECENT_ORDERS.map((order) => (
                                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="grid gap-1">
                                        <p className="font-medium">Order #{order.id}</p>
                                        <p className="text-sm text-muted-foreground">{order.date}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-medium">${order.total}</p>
                                            <div className="text-xs text-muted-foreground">{order.status}</div>
                                        </div>
                                        <Link href={`/vendor/orders/${order.id}`}>
                                            <Button size="sm" variant="ghost">View</Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
