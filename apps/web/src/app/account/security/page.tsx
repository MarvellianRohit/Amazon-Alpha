"use client";

import { useAuthSecurity } from "@/hooks/use-auth-security";
import { MFAEnrollment } from "@/components/auth/mfa-enrollment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Laptop, Smartphone, Trash2, Key, ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function SecurityPage() {
    const { factors, unenrollFactor, loading } = useAuthSecurity();
    const [sessions, setSessions] = useState([
        { id: '1', device: 'MacBook Pro', location: 'San Francisco, US', active: true, type: 'desktop' },
        { id: '2', device: 'iPhone 15', location: 'San Francisco, US', active: false, lastActive: '2 hours ago', type: 'mobile' },
    ]);

    // Mock Passkey Logic
    const handleRegisterPasskey = () => {
        alert("Triggering WebAuthn Registration... (This requires HTTPS environment)");
        // navigator.credentials.create(...)
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Security Dashboard
                </h1>
                <p className="text-gray-500">Manage your ease of access and account protection.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* MFA Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                                Multi-Factor Authentication
                            </CardTitle>
                            <MFAEnrollment />
                        </div>
                        <CardDescription>
                            Adds an extra layer of security to your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <p>Loading factors...</p>
                        ) : factors.length > 0 ? (
                            <div className="space-y-4">
                                {factors.map((factor) => (
                                    <div key={factor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-100 p-2 rounded-full">
                                                <Key className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{factor.friendly_name || 'Authenticator App'}</p>
                                                <p className="text-xs text-gray-500">Added on {new Date(factor.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => unenrollFactor(factor.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                                No MFA factors enrolled.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Passkeys Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Fingerprint className="w-5 h-5 text-purple-600" />
                                Passkeys
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={handleRegisterPasskey}>
                                Add Passkey
                            </Button>
                        </div>
                        <CardDescription>
                            Login with TouchID or FaceID.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                            No passkeys registered.
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Active Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Laptop className="w-5 h-5 text-gray-700" />
                        Active Sessions
                    </CardTitle>
                    <CardDescription>
                        Devices that are currently logged into your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-100 p-3 rounded-full">
                                        {session.type === 'mobile' ? <Smartphone className="w-5 h-5 text-gray-600" /> : <Laptop className="w-5 h-5 text-gray-600" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{session.device}</p>
                                            {session.active && <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Current Session</Badge>}
                                        </div>
                                        <p className="text-sm text-gray-500">{session.location} • {session.active ? 'Active Now' : session.lastActive}</p>
                                    </div>
                                </div>
                                {!session.active && (
                                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                        Revoke
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
