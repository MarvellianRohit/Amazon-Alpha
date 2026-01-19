"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Zap } from "lucide-react";

interface MobileStickyFooterProps {
    price: number;
    studentPrice?: number;
    isStudent?: boolean;
    onAddToCart: () => void;
    onBuyNow: () => void;
    isInStock: boolean;
}

export function MobileStickyFooter({ price, studentPrice, isStudent, onAddToCart, onBuyNow, isInStock }: MobileStickyFooterProps) {
    const finalPrice = (isStudent && studentPrice) ? studentPrice : price;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4 z-50 safe-area-bottom shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-4 container mx-auto px-0">
                <div className="flex-1">
                    {isStudent && studentPrice ? (
                        <>
                            <div className="text-[10px] text-red-600 font-bold uppercase tracking-wide">Student Price</div>
                            <div className="text-xl font-bold text-gray-900 flex items-baseline gap-2">
                                ${finalPrice.toFixed(2)}
                                <span className="text-xs text-gray-400 line-through font-normal">${price.toFixed(2)}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
                            <div className="text-xl font-bold text-gray-900">${price.toFixed(2)}</div>
                        </>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-12 w-12 border-yellow-500 text-yellow-600 bg-yellow-50"
                        onClick={onAddToCart}
                        disabled={!isInStock}
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </Button>
                    <Button
                        className="h-12 px-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                        onClick={onBuyNow}
                        disabled={!isInStock}
                    >
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
    );
}
