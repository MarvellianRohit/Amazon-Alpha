"use client";

import { useState } from "react";
import { useAuthSecurity } from "@/hooks/use-auth-security";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";

export function MFAEnrollment() {
    const { enrollTOTP, verifyFactor } = useAuthSecurity();
    const [step, setStep] = useState<'start' | 'scan' | 'verify'>('start');
    const [qrData, setQrData] = useState<{ qr_code: string; id: string } | null>(null);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleStart = async () => {
        setLoading(true);
        const data = await enrollTOTP();
        if (data) {
            setQrData({ id: data.id, qr_code: data.totp.qr_code });
            setStep('scan');
        }
        setLoading(false);
    };

    const handleVerify = async () => {
        if (!qrData) return;
        setLoading(true);
        const success = await verifyFactor(qrData.id, code);
        if (success) {
            setIsOpen(false);
            setStep('start');
        }
        setLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <ShieldCheck className="w-4 h-4" />
                    Enable MFA
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
                    <DialogDescription>
                        Secure your account using Google Authenticator or Authy.
                    </DialogDescription>
                </DialogHeader>

                {step === 'start' && (
                    <div className="py-4">
                        <p className="text-sm text-gray-500 mb-4">
                            Click below to generate a QR code for your authenticator app.
                        </p>
                        <Button onClick={handleStart} disabled={loading} className="w-full">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Generate QR Code
                        </Button>
                    </div>
                )}

                {step === 'scan' && qrData && (
                    <div className="py-4 space-y-4 flex flex-col items-center">
                        <div className="bg-white p-4 rounded-xl border shadow-sm">
                            {/* Mock rendering of SVG QR or Image if URL */}
                            {/* Supabase returns an SVG string usually or a URL. 
                                 For safety, we assume it's an SVG data URI or similar. 
                             */}
                            <img src={qrData.qr_code} alt="QR Code" className="w-48 h-48" />
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            Scan this with your Authenticator App
                        </p>
                        <div className="w-full space-y-2">
                            <Label>Enter 6-digit Code</Label>
                            <Input
                                placeholder="123456"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="text-center text-lg tracking-widest"
                                maxLength={6}
                            />
                        </div>
                        <Button onClick={handleVerify} disabled={loading || code.length !== 6} className="w-full">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Enable"}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
