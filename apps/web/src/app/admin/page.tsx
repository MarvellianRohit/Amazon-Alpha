"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle>Admin Portal</CardTitle>
                    <CardDescription>Restricted access area.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-sm text-muted-foreground">
                        You have arrived at the admin portal. Use the links below to navigate to specific administrative functions.
                    </p>
                    <div className="grid gap-2">
                        <Link href="/admin/approvals">
                            <Button className="w-full" variant="outline">Approvals</Button>
                        </Link>
                        <Link href="/admin/dashboard">
                            <Button className="w-full" variant="outline">Dashboard</Button>
                        </Link>
                        <Link href="/admin/vendors">
                            <Button className="w-full" variant="outline">Manage Vendors</Button>
                        </Link>
                        <Link href="/">
                            <Button className="w-full" variant="ghost">Return Home</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
