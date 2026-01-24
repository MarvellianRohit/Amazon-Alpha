"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, Factory, MapPin, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Mock Data Structure
interface PassportData {
    token_id: string;
    contract: string;
    batch_number: string;
    manufacturing_date: string;
    logistics_path: { location: string; date: string; status: string }[];
}

export function ProductPassport({ productId }: { productId: string }) {
    // In real app, fetch from API
    const passportData: PassportData = {
        token_id: "847291",
        contract: "0xABC...123",
        batch_number: "BATCH-2026-X99",
        manufacturing_date: "2025-11-15",
        logistics_path: [
            { location: "Shanghai Factory", date: "2025-11-20", status: "Dispatched" },
            { location: "Port of LA", date: "2025-12-05", status: "Customs Cleared" },
            { location: "Amazon Fulfillment (NV)", date: "2025-12-10", "status": "Stored" },
            { location: "Customer Doorstep", date: "2026-01-15", "status": "Delivered" }
        ]
    };

    const [transferred, setTransferred] = useState(false);

    const handleTransfer = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Interacting with Polygon Network...',
                success: () => {
                    setTransferred(true);
                    return 'Ownership Transferred to Wallet 0x987...def';
                },
                error: 'Transfer failed',
            }
        );
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-black/50">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-sm">Digital Product Passport</span>
                </div>
                <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                    Polygon Verified
                </Badge>
            </div>

            <div className="p-6 space-y-6">
                {/* Meta Data */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="text-neutral-500 text-xs uppercase mb-1">Batch Number</div>
                        <div className="font-mono font-medium">{passportData.batch_number}</div>
                    </div>
                    <div>
                        <div className="text-neutral-500 text-xs uppercase mb-1">Token ID</div>
                        <div className="font-mono font-medium">#{passportData.token_id}</div>
                    </div>
                    <div>
                        <div className="text-neutral-500 text-xs uppercase mb-1">Contract</div>
                        <div className="font-mono text-xs text-blue-500 underline cursor-pointer truncate">
                            {passportData.contract}
                        </div>
                    </div>
                    <div>
                        <div className="text-neutral-500 text-xs uppercase mb-1">Mfg Date</div>
                        <div className="font-medium">{passportData.manufacturing_date}</div>
                    </div>
                </div>

                {/* Timeline */}
                <div>
                    <div className="text-xs font-bold uppercase text-neutral-500 mb-3">Supply Chain Journey</div>
                    <div className="relative pl-4 border-l-2 border-neutral-200 dark:border-neutral-700 space-y-6">
                        {passportData.logistics_path.map((step, i) => (
                            <div key={i} className="relative">
                                {/* Dot */}
                                <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-black ${i === passportData.logistics_path.length - 1 ? 'bg-green-500' : 'bg-neutral-400'}`} />

                                <div className="text-sm font-bold">{step.status}</div>
                                <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3" /> {step.location} • {step.date}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <Button
                        onClick={handleTransfer}
                        disabled={transferred}
                        className={`w-full ${transferred ? 'bg-green-600 hover:bg-green-600' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
                    >
                        {transferred ? (
                            <span className="flex items-center gap-2">Transferred <ShieldCheck className="w-4 h-4" /></span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" /> Transfer Ownership (Resell)
                            </span>
                        )}
                    </Button>
                    <p className="text-[10px] text-center text-neutral-400 mt-2">
                        This action records a permanent transaction on the blockchain.
                    </p>
                </div>
            </div>
        </div>
    );
}
