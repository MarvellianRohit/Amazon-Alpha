'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2, Check } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

interface OneTapCheckoutProps {
    productTitle: string;
    price: number;
}

export function OneTapCheckout({ productTitle, price }: OneTapCheckoutProps) {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
    const [open, setOpen] = useState(false);

    const handlePurchase = async () => {
        setStatus('processing');
        // Simulate Sub-2-Second Fast Checkout
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('success');
        setTimeout(() => {
            setOpen(false);
            setStatus('idle');
        }, 2000);
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg">
                    <ShoppingBag className="w-4 h-4 mr-1" /> Buy Now
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>One-Tap Checkout ⚡️</DrawerTitle>
                        <DrawerDescription>Review your fast purchase.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                            <span className="font-medium text-slate-700">{productTitle}</span>
                            <span className="font-bold text-lg">${price.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-slate-600 p-2 border border-slate-200 rounded">
                            <div className="w-8 h-5 bg-slate-300 rounded overflow-hidden relative">
                                {/* Mock Visa Card */}
                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                            <span>Visa ending in 4242</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-slate-600 p-2 border border-slate-200 rounded">
                            <span>📍 123 Main St, Tech City, CA</span>
                        </div>
                    </div>
                    <DrawerFooter>
                        <Button
                            className={`w-full h-12 text-lg font-bold transition-all ${status === 'success' ? 'bg-green-600' : 'bg-indigo-600'}`}
                            onClick={handlePurchase}
                            disabled={status !== 'idle'}
                        >
                            {status === 'idle' && `Pay $${price.toFixed(2)}`}
                            {status === 'processing' && <Loader2 className="w-6 h-6 animate-spin" />}
                            {status === 'success' && <div className="flex items-center gap-2"><Check className="w-6 h-6" /> Paid!</div>}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
