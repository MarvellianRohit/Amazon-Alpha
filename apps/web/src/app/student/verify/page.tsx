"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { GraduationCap, Mail, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/components/providers/auth-provider"; // Assuming useAuth exists and allows updating user status

export default function StudentVerifyPage() {
    const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    // const { updateUser } = useAuth(); // Mocking this for now

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (!email.endsWith('.edu')) {
            toast.error("Please use a valid .edu email address.");
            setIsLoading(false);
            return;
        }

        toast.success("OTP sent to " + email);
        setStep('otp');
        setIsLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate Verification
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (otp === "123456") {
            setStep('success');
            toast.success("Student Verified! Unlocking discounts...");

            // In a real app, we would update the user session context here
            // e.g. updateUser({ isStudent: true });
            localStorage.setItem("is_student_verified", "true"); // Fallback for demo
        } else {
            toast.error("Invalid OTP. Try 123456");
        }
        setIsLoading(false);
    };

    if (step === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <Card className="w-full max-w-md border-green-200 bg-green-50">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <CardTitle className="text-green-800">You're Verified!</CardTitle>
                        <CardDescription className="text-green-700">
                            Welcome to the Student Program. You now have access to exclusive pricing across the store.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => router.push('/')}>
                            Start Shopping <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Student Program</span>
                    </div>
                    <CardTitle>Verify your Student Status</CardTitle>
                    <CardDescription>
                        {step === 'email'
                            ? "Enter your university email address to unlock exclusive student pricing."
                            : `Enter the 6-digit code sent to ${email}`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'email' ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">University Email (.edu)</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@university.edu"
                                        className="pl-9"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Send Verification Code
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp">Verification Code</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="123456"
                                    className="text-center text-2xl tracking-widest letter-spacing-2"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                                <p className="text-xs text-muted-foreground text-center">
                                    Didnt receive it? <button type="button" className="text-blue-600 hover:underline" onClick={() => setStep('email')}>Resend</button>
                                </p>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Unlock"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
