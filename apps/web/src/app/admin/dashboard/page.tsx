
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, CreditCard, DollarSign, Users, AlertCircle, Check, X, Shield } from "lucide-react"

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
            <div className="container mx-auto max-w-6xl space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center">
                            <Shield className="mr-3 h-8 w-8 text-red-500" /> Admin "God Mode"
                        </h1>
                        <p className="text-slate-400">Platform overview and compliance management.</p>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="destructive">System Lockdown</Button>
                    </div>
                </div>

                {/* Global Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">Total Volume</CardTitle>
                            <DollarSign className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">$1,234,567</div>
                            <p className="text-xs text-slate-400">+12% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">Pending Vendors</CardTitle>
                            <Users className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">12</div>
                            <p className="text-xs text-slate-400">Requires Review</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">Disputes</CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">3</div>
                            <p className="text-xs text-slate-400">Active escalations</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">System Health</CardTitle>
                            <Activity className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">99.9%</div>
                            <p className="text-xs text-slate-400">All systems operational</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Vendor Approvals */}
                    <Card className="col-span-2 bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Vendor Approval Queue</CardTitle>
                            <CardDescription className="text-slate-400">Review new seller applications.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0">
                                        <div>
                                            <p className="font-medium text-white">TechInnovators Ltd.</p>
                                            <p className="text-sm text-slate-400">Electronics • Applied 2 days ago</p>
                                            <div className="flex gap-2 mt-1">
                                                <Badge variant="outline" className="text-xs border-slate-700 text-slate-300">ID Verified</Badge>
                                                <Badge variant="outline" className="text-xs border-slate-700 text-slate-300">Bank Linked</Badge>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                                            <Button size="sm" variant="outline" className="text-red-400 border-red-900 hover:bg-red-950">Deny</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Activity */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Live Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 relative pl-4 border-l border-slate-800">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-slate-900"></div>
                                    <p className="text-sm text-slate-200">New order #9923 placed</p>
                                    <p className="text-xs text-slate-500">2 mins ago</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-green-500 ring-4 ring-slate-900"></div>
                                    <p className="text-sm text-slate-200">Vendor "Nike Official" payout processed</p>
                                    <p className="text-xs text-slate-500">15 mins ago</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-yellow-500 ring-4 ring-slate-900"></div>
                                    <p className="text-sm text-slate-200">High traffic alert: Shoes Category</p>
                                    <p className="text-xs text-slate-500">1 hour ago</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
