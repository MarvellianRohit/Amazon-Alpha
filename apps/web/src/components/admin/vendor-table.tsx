"use client";

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Vendor } from "@/types";
import { VendorRow } from "./vendor-row";

interface VendorTableProps {
    vendors: Vendor[];
}

export function VendorTable({ vendors }: VendorTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Namew</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vendors.map((vendor) => (
                        <VendorRow key={vendor.id} vendor={vendor} />
                    ))}
                    {vendors.length === 0 && (
                        <TableRow>
                            <td colSpan={5} className="h-24 text-center text-muted-foreground">
                                No vendors found.
                            </td>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
