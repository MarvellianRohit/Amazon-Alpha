"use client";

import { useState } from "react";
import { VendorTable } from "@/components/admin/vendor-table";
import { Vendor } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

// Mock Data for Development
const MOCK_VENDORS: Vendor[] = [
    {
        id: "v1",
        name: "TechGear Pro",
        email: "contact@techgear.io",
        isSuspended: false,
        vacationMode: false,
        createdAt: "2024-01-15T12:00:00Z"
    },
    {
        id: "v2",
        name: "EcoStyle Fashion",
        email: "alice@ecostyle.com",
        isSuspended: true, // Suspended vendor
        vacationMode: false,
        createdAt: "2024-02-20T09:30:00Z"
    },
    {
        id: "v3",
        name: "Gadget Hub",
        email: "support@gadgethub.net",
        isSuspended: false,
        vacationMode: true, // On vacation
        createdAt: "2023-11-05T15:45:00Z"
    }
];

export default function VendorsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [vendors] = useState<Vendor[]>(MOCK_VENDORS);

    const filteredVendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto py-10 px-4 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vendor Management</h1>
                    <p className="text-muted-foreground">
                        Monitor and manage platform sellers.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/admin">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Vendor
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search vendors..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <VendorTable vendors={filteredVendors} />
        </div>
    );
}
