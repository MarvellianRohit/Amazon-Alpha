"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Zap, Lock } from "lucide-react";

interface ProductSidebarProps {
    product: any;
    isStudent?: boolean;
    studentPrice?: number;
    onAddToCart: () => void;
    onBuyNow: () => void;
}

export function ProductSidebar({ product, isStudent, studentPrice, onAddToCart, onBuyNow }: ProductSidebarProps) {
    const isInStock = (product.stock || 0) > 0;

    // Logic: Use student price if verified, else regular.
    const finalPrice = (isStudent && studentPrice) ? studentPrice : parseFloat(product.price);
    const regularPrice = parseFloat(product.price);

    return (
        <div className="sticky top-24">
            <Card className="border-2 border-gray-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardContent className="p-6 space-y-6">

                    {/* Price Display */}
                    <div>
                        {isStudent && studentPrice ? (
                            <div className="space-y-1">
                                <div className="text-3xl font-bold text-red-700 flex items-center gap-2">
                                    ${finalPrice.toFixed(2)}
                                    <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-200">
                                        Student Deal
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 line-through">
                                    ${regularPrice.toFixed(2)}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="text-3xl font-bold text-gray-900">
                                    ${regularPrice.toFixed(2)}
                                </div>
                                {/* Unlock CTA */}
                                <a href="/student/verify" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                    <Lock className="w-3 h-3" />
                                    Unlock Student Discount (Save 10%)
                                </a>
                            </div>
                        )}

                        <div className="text-sm text-gray-500 mt-2">
                            Free Returns & Free Delivery
                        </div>
                    </div>

                    {/* Stock Status */}
                    <div className={`text-lg font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                        {isInStock ? 'In Stock' : 'Currently Unavailable'}
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Button
                            className="w-full h-12 text-base font-semibold bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-500"
                            onClick={onAddToCart}
                            disabled={!isInStock}
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Cart
                        </Button>

                        <Button
                            className="w-full h-12 text-base font-semibold bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={onBuyNow}
                            disabled={!isInStock}
                        >
                            <Zap className="w-5 h-5 mr-2" />
                            Buy Now
                            <span className="ml-2 px-1.5 py-0.5 bg-orange-800 rounded text-xs opacity-80 border border-orange-500/50">B</span>
                        </Button>
                    </div>

                    {/* Seller Info */}
                    <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
                        <div className="flex justify-between">
                            <span>Ships from</span>
                            <span className="font-medium text-gray-900">Amazon Alpha</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Sold by</span>
                            <span className="font-medium text-blue-600 cursor-pointer hover:underline">
                                {product.vendor_name || "Third Party Vendor"}
                            </span>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 justify-center pt-2">
                        <Lock className="w-3 h-3" />
                        <span>Secure transaction</span>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
