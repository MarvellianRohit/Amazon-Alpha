'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ResaleModalProps {
    tokenId: string;
    productName: string;
    trigger?: React.ReactNode;
}

export function ResaleModal({ tokenId, productName, trigger }: ResaleModalProps) {
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleList = async () => {
        setLoading(true);
        // Simulate API call to list resale (`/api/v1/blockchain/list_for_resale`)
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        setOpen(false);
        // In real app, trigger toast or refresh
        alert(`Listed ${productName} (Token #${tokenId}) for $${price}`);
    };

    const numPrice = parseFloat(price) || 0;
    const royalty = numPrice * 0.02;
    const payout = numPrice - royalty;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline" size="sm">List for Resale</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>List on Secondary Market</DialogTitle>
                    <DialogDescription>
                        Set a price to list your Digital Twin for {productName}.
                        The ownership will be transferred via Smart Contract escrow.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price ($)
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="col-span-3"
                            placeholder="0.00"
                        />
                    </div>
                    {numPrice > 0 && (
                        <div className="rounded-md bg-slate-50 p-3 text-sm space-y-1">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Sales Price:</span>
                                <span className="font-medium">${numPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-amber-600">
                                <span>Vendor Royalty (2%):</span>
                                <span>-${royalty.toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-1 mt-1 flex justify-between font-bold text-green-700">
                                <span>Your Payout:</span>
                                <span>${payout.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleList} disabled={loading || numPrice <= 0}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        List Item
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
