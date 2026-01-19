"use client";

import { useEffect, useState } from "react";
import { VerificationForm } from "@/components/student/verification-form";
import { SpecialDealsGrid } from "@/components/student/special-deals";
import { Crown, Lock } from "lucide-react";

export default function StudentClubPage() {
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock verification check
        if (typeof window !== 'undefined') {
            const verified = localStorage.getItem("is_verified_student") === "true";
            setIsVerified(verified);
        }
        setIsLoading(false);
    }, []);

    if (isLoading) return <div className="min-h-screen bg-indigo-950" />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 text-white">
            <div className="container mx-auto px-4 py-12 md:py-20">

                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-amber-500/20 rounded-full mb-4">
                        <Crown className="w-10 h-10 text-amber-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                        The Student Club
                    </h1>
                    <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
                        Unlock the ultimate student experience. Exclusive pricing, early access drops, and premium perks.
                    </p>
                </div>

                {/* Conditional Rendering */}
                <div className="max-w-5xl mx-auto">
                    {isVerified ? (
                        <SpecialDealsGrid />
                    ) : (
                        <div className="space-y-8">
                            <VerificationForm />

                            <div className="text-center text-sm text-indigo-300 flex items-center justify-center gap-2">
                                <Lock className="w-3 h-3" />
                                Secure Verification via College ID
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
