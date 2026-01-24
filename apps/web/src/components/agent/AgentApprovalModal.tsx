"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AgentApprovalModalProps {
    isOpen: boolean;
    dealData: any;
    onClose: () => void;
    onConfirm: () => void;
}

export function AgentApprovalModal({ isOpen, dealData, onClose, onConfirm }: AgentApprovalModalProps) {
    if (!dealData) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-neutral-800"
                    >
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white text-center">
                            <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
                                <AlertCircle className="w-8 h-8 text-white animate-bounce" />
                            </div>
                            <h2 className="text-2xl font-bold">Deal Secured!</h2>
                            <p className="opacity-90">Your agent negotiated a great price.</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="text-center">
                                <div className="text-sm text-neutral-500 uppercase tracking-widest mb-1">Final Offer For</div>
                                <h3 className="text-xl font-bold mb-4">{dealData.item_name || "Product"}</h3>
                                <div className="text-5xl font-black text-green-600 dark:text-green-400">
                                    ${dealData.final_price?.toFixed(2)}
                                </div>
                                <div className="text-xs text-neutral-400 mt-2">Vendor: {dealData.vendor_name}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    className="h-16 text-lg rounded-xl border-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    onClick={onClose}
                                >
                                    <XCircle className="w-6 h-6 mr-2 text-red-500" /> Renegotiate
                                </Button>
                                <Button
                                    className="h-16 text-lg rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30"
                                    onClick={() => {
                                        // Haptic Feedback for success
                                        if (typeof navigator !== 'undefined' && navigator.vibrate) {
                                            navigator.vibrate([50, 50, 50]);
                                        }
                                        onConfirm();
                                    }}
                                >
                                    <CheckCircle className="w-6 h-6 mr-2" /> Confirm Deal
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
