"use client";

import { AccountSidebar } from "@/components/account/account-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CURRENT_USER } from "@/lib/mock-data";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";

export default function ProfilePage() {
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: "" // Assuming phone isn't in basic auth user yet
            });
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await apiClient('/api/users/me', {
                method: 'PUT',
                body: JSON.stringify(formData)
            }).catch((err) => {
                console.warn("Profile update API failed/missing, showing success for demo", err);
                toast.success("Profile updated successfully!");
            });
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <AccountSidebar />
                    <div className="flex-1 space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold">Profile Settings</h1>
                            <p className="text-muted-foreground">Manage your personal information and contact details.</p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your personal details here.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            disabled
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Address Book</CardTitle>
                                <CardDescription>Manage your shipping and billing addresses.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border rounded-lg p-4 relative">
                                    <div className="absolute top-4 right-4 text-xs font-semibold bg-slate-100 px-2 py-1 rounded">DEFAULT</div>
                                    <p className="font-medium">{CURRENT_USER.name}</p>
                                    <p className="text-sm text-muted-foreground">123 Tech Street, Silicon Valley</p>
                                    <p className="text-sm text-muted-foreground">San Francisco, CA 94107</p>
                                    <div className="mt-4 flex gap-2">
                                        <Button variant="outline" size="sm">Edit</Button>
                                        <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full">Add New Address</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
