"use client";

import { DashboardGrid } from "@/components/vendor/dashboard-grid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"

export default function VendorDashboardPage() {
    // State for Vacation Mode
    const [vacationMode, setVacationMode] = useState(false)

    const toggleVacationMode = (checked: boolean) => {
        setVacationMode(checked)
        if (checked) {
            toast.warning("Vacation Mode Activated - Your listings are hidden.")
        } else {
            toast.success("Welcome back! Your listings are live.")
        }
    }

    return (
        <div className="flex-1 space-y-6 p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Seller Central</h2>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center gap-2 mr-4 border p-2 rounded-md bg-white">
                        <Switch id="vacation-mode" checked={vacationMode} onCheckedChange={toggleVacationMode} />
                        <Label htmlFor="vacation-mode">Vacation Mode</Label>
                    </div>

                    <Button asChild>
                        <Link href="/vendor/products/add">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/vendor/payouts">
                            Payouts
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Draggable Dashboard Grid (Metrics, Charts, Inventory) */}
            <DashboardGrid />
        </div>
    );
}
