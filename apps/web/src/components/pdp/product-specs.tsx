"use client";

import { Star, ShieldCheck, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProductSpecsProps {
    product: any;
}

export function ProductSpecs({ product }: ProductSpecsProps) {
    return (
        <div className="space-y-8">
            {/* Header Info */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-medium text-sm hover:underline cursor-pointer">
                        {product.category || "Electronics"}
                    </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                    {product.name}
                </h1>

                <div className="flex items-center gap-4">
                    <div className="flex items-center text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                        <span className="text-gray-500 ml-2 text-sm">(128 ratings)</span>
                    </div>
                    <Separator orientation="vertical" className="h-5" />
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        #{product.id.slice(0, 4)} Best Seller
                    </Badge>
                </div>
            </div>

            <Separator />

            {/* Narrative Description */}
            <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold">About this item</h3>
                <p className="text-gray-700 leading-relaxed">
                    {product.description || "Experience premium quality with this state-of-the-art product. Designed for professionals who demand the best in performance and aesthetics."}
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4 text-gray-700">
                    <li>High-performance M3-class speed and efficiency.</li>
                    <li>Premium build quality with aerospace-grade materials.</li>
                    <li>Designed for optimal workflow and comfort.</li>
                </ul>
            </div>

            <Separator />

            {/* Technical Specs Table */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div className="flex border-b border-gray-100 pb-2">
                        <span className="text-gray-500 w-1/3">Manufacturer</span>
                        <span className="font-medium text-gray-900">{product.vendor_name || "Amazon Alpha"}</span>
                    </div>
                    <div className="flex border-b border-gray-100 pb-2">
                        <span className="text-gray-500 w-1/3">Stock Code</span>
                        <span className="font-medium text-gray-900">{product.id.split('-')[0].toUpperCase()}</span>
                    </div>
                    <div className="flex border-b border-gray-100 pb-2">
                        <span className="text-gray-500 w-1/3">Weight</span>
                        <span className="font-medium text-gray-900">1.2 kg</span>
                    </div>
                    <div className="flex border-b border-gray-100 pb-2">
                        <span className="text-gray-500 w-1/3">Dimensions</span>
                        <span className="font-medium text-gray-900">12 x 8 x 2 in</span>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center text-center gap-2 p-4 bg-blue-50/50 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                    <span className="text-xs font-medium text-blue-900">2 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-4 bg-green-50/50 rounded-lg">
                    <Truck className="w-6 h-6 text-green-600" />
                    <span className="text-xs font-medium text-green-900">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-4 bg-purple-50/50 rounded-lg">
                    <Star className="w-6 h-6 text-purple-600" />
                    <span className="text-xs font-medium text-purple-900">Top Rated</span>
                </div>
            </div>
        </div>
    );
}
