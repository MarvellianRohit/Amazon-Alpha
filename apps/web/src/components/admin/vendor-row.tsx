'use client';

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Vendor } from "@/types";
import { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

interface VendorRowProps {
    vendor: Vendor;
}

export function VendorRow({ vendor }: VendorRowProps) {
    const [isSuspended, setIsSuspended] = useState(vendor.isSuspended);

    const toggleSuspension = async () => {
        // Optimistic update
        const newState = !isSuspended;
        setIsSuspended(newState);

        // TODO: Call API to update DB
        console.log(`Vendor ${vendor.id} suspended: ${newState}`);
    };

    return (
        <TableRow>
            <TableCell className="font-medium">{vendor.name}</TableCell>
            <TableCell>{vendor.email}</TableCell>
            <TableCell>
                <Badge variant={isSuspended ? "destructive" : "outline"} className="gap-1">
                    {isSuspended ? (
                        <><AlertCircle className="w-3 h-3" /> Suspended</>
                    ) : (
                        <><CheckCircle className="w-3 h-3 text-green-500" /> Active</>
                    )}
                </Badge>
            </TableCell>
            <TableCell>{new Date(vendor.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                    <span className="text-sm text-muted-foreground mr-2">
                        {isSuspended ? "Revoke Access" : "Grant Access"}
                    </span>
                    <Switch
                        checked={!isSuspended}
                        onCheckedChange={() => toggleSuspension()}
                        className="data-[state=unchecked]:bg-destructive"
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}
