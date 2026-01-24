"use client";

import { CryptoPayment } from "@/components/checkout/CryptoPayment";
import { ArrowLeft, ShieldCheck, Wallet, Zap } from "lucide-react";
import Link from "next/link";

export default function CryptoPaymentPage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black p-4 lg:p-10">
            <div className="max-w-md mx-auto">
                <Link href="/" className="inline-flex items-center text-sm text-neutral-500 mb-8 hover:text-black dark:hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
                </Link>

                <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#5865F2] to-[#4752C4] p-8 text-white text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <Wallet className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Crypto Checkout</h1>
                        <p className="text-white/80 text-sm">Secure, fast, and decentralized payments.</p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Order Summary Mock */}
                        <div>
                            <h3 className="text-xs font-bold text-neutral-500 uppercase mb-4">Order Summary</h3>
                            <div className="flex justify-between items-center mb-2">
                                <span>Total Amount</span>
                                <span className="font-bold text-lg">$142.50</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-neutral-500">
                                <span>ETH Equivalent</span>
                                <span className="font-mono">0.045 ETH</span>
                            </div>
                        </div>

                        <div className="border-t border-neutral-200 dark:border-neutral-800 my-4" />

                        {/* The Component */}
                        <div>
                            <h3 className="text-xs font-bold text-neutral-500 uppercase mb-4">Payment Method</h3>
                            <CryptoPayment />
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                                <ShieldCheck className="w-4 h-4 text-green-500" /> Secure Protocol
                            </div>
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                                <Zap className="w-4 h-4 text-yellow-500" /> Instant Confirm
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
