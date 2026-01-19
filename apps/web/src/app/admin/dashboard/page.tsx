'use client';

import { StatCard } from "@/components/vendor/stat-card";
import { VendorRow } from "@/components/admin/vendor-row";
import { CommissionTracker } from "@/components/admin/commission-tracker";
import { SystemHealthChart } from "@/components/admin/system-health-chart";
import { VendorApprovalTable } from "@/components/admin/vendor-approval-table";
import { DeveloperSync } from "@/components/admin/developer-sync";
import { Users, Store, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vendor } from "@/types";

// Mock Data
const MOCK_VENDORS: Vendor[] = [
    {
        id: '1',
        name: 'TechGiant Inc.',
        email: 'contact@techgiant.com',
        vacationMode: false,
        isSuspended: false,
        createdAt: '2023-01-15T10:00:00Z'
    },
    {
        id: '2',
        name: 'FastFashion Co.',
        email: 'sales@fastfashion.com',
        vacationMode: true,
        isSuspended: false,
        createdAt: '2023-03-22T14:30:00Z'
    },
    {
        id: '3',
        name: 'Scammy Seller',
        email: 'fake@scam.com',
        vacationMode: false,
        isSuspended: true,
        createdAt: '2023-11-05T09:15:00Z'
    }
];

export default function AdminDashboardPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-red-600 flex items-center gap-2">
                    <ShieldAlert className="h-8 w-8" />
                    God Mode Admin
                </h2>
            </div>

            <div className="mb-6">
                <DeveloperSync />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <CommissionTracker />
                <SystemHealthChart />
                <StatCard
                    title="Suspicious Orders"
                    value="3"
                    description="Flagged by AI"
                    icon={AlertTriangle}
                    trend={{ value: 2, isPositive: false }}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-500" />
                            Vendor Approval Queue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <VendorApprovalTable />
                    </CardContent>
                </Card>

                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-700 text-base flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5" />
                            Compliance & Kill Switch
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vendor Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_VENDORS.map((vendor) => (
                                    <VendorRow key={vendor.id} vendor={vendor} />
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
