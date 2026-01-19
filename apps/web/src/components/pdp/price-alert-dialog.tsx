"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BellRing, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PriceAlertDialogProps {
    productId: string;
    currentPrice: number;
}

export function PriceAlertDialog({ productId, currentPrice }: PriceAlertDialogProps) {
    const [targetPrice, setTargetPrice] = useState(Math.floor(currentPrice * 0.9).toString());
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateAlert = async () => {
        setIsLoading(true);
        // Mock API Call to DB
        // In real app: supabase.from('price_alerts').insert(...)
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success(`We'll notify you if price drops below $${targetPrice}`);
        setIsOpen(false);
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <BellRing className="w-4 h-4 text-blue-600" />
                    Track Price
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Set Price Alert</DialogTitle>
                    <DialogDescription>
                        Receive a notification when this product becomes cheaper.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="current" className="text-right">Current</Label>
                        <Input id="current" value={`$${currentPrice}`} disabled className="col-span-3 bg-gray-50" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="target" className="text-right text-blue-600 font-bold">Target</Label>
                        <Input
                            id="target"
                            type="number"
                            value={targetPrice}
                            onChange={(e) => setTargetPrice(e.target.value)}
                            className="col-span-3 border-blue-200 focus-visible:ring-blue-500"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleCreateAlert} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Set Alert
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
