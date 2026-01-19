"use client";

import { useEffect, useState } from "react";
import { SignaturePad } from "@/components/student/signature-pad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Award, BookOpen, Crown } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function StudentHubPage() {
    const [signature, setSignature] = useState<string | null>(null);
    const [isAccepted, setIsAccepted] = useState(false);
    const router = useRouter();

    const handleAccept = () => {
        if (!signature) {
            toast.error("Please sign the Honor Code first.");
            return;
        }
        setIsAccepted(true);
        toast.success("Welcome to the Elite Student Tier!");
        // Persist acceptance in real app
        setTimeout(() => router.push('/'), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-900 text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-400">
                            Student Hub
                        </h1>
                        <p className="text-indigo-200 mt-2 text-lg">Your gateway to exclusive academic perks.</p>
                    </div>
                    <Crown className="w-16 h-16 text-amber-400 opacity-20" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Perk Cards */}
                    <div className="space-y-4">
                        <Card className="bg-white/10 border-white/10 text-white backdrop-blur-sm hover:bg-white/15 transition-colors">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="p-2 bg-amber-500/20 rounded-full">
                                    <Award className="w-6 h-6 text-amber-300" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">Elite Pricing</CardTitle>
                                    <CardDescription className="text-indigo-200">Save 10% on all tech & essentials</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card className="bg-white/10 border-white/10 text-white backdrop-blur-sm hover:bg-white/15 transition-colors">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="p-2 bg-purple-500/20 rounded-full">
                                    <BookOpen className="w-6 h-6 text-purple-300" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">Free Prime Student</CardTitle>
                                    <CardDescription className="text-indigo-200">6-months free shipping & streaming</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Honor Code & Signature */}
                    <div className="space-y-6">
                        <Card className="bg-white text-gray-900 border-none shadow-2xl">
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                                    <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Official Agreement</span>
                                </div>
                                <CardTitle>Student Honor Code</CardTitle>
                                <CardDescription>
                                    By signing below, I certify that I am currently enrolled in an accredited university and will not resell discounted items.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <SignaturePad onSign={setSignature} />

                                <Button
                                    className={`w-full h-12 text-lg font-bold transition-all ${isAccepted
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                        }`}
                                    onClick={handleAccept}
                                    disabled={!signature || isAccepted}
                                >
                                    {isAccepted ? "Accepted! Redirecting..." : "Sign & Unlock Hub"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
