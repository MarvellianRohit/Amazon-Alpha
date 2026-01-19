"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock Data
const PENDING_VENDORS = [
    { id: '101', name: 'New Age Gadgets', email: 'apply@nag.com', submitted: '2 mins ago' },
    { id: '102', name: 'Organic Soaps Ltd', email: 'sarah@organic.com', submitted: '1 hour ago' },
];

export function VendorApprovalTable() {
    const [vendors, setVendors] = useState(PENDING_VENDORS);

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        // In real app: Call API to update status
        setVendors(prev => prev.filter(v => v.id !== id));
        if (action === 'approve') {
            toast.success("Vendor Approved");
        } else {
            toast.info("Vendor Rejected");
        }
    };

    if (vendors.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border rounded-md min-h-[200px] text-muted-foreground bg-slate-50">
                <Check className="w-10 h-10 mb-2 opacity-20" />
                <p>No pending approvals. great job!</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Vendor Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vendors.map((vendor) => (
                        <TableRow key={vendor.id}>
                            <TableCell className="font-medium">{vendor.name}</TableCell>
                            <TableCell>{vendor.email}</TableCell>
                            <TableCell className="text-muted-foreground text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {vendor.submitted}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200" onClick={() => handleAction(vendor.id, 'approve')}>
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => handleAction(vendor.id, 'reject')}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
