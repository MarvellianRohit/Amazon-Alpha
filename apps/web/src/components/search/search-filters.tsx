'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

export function SearchFilters() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold mb-3">Brand</h3>
                <div className="space-y-2">
                    {['Apple', 'Samsung', 'Sony', 'Bose', 'Logitech'].map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                            <Checkbox id={`brand-${brand}`} />
                            <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {brand}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <Slider defaultValue={[200]} max={2000} step={10} className="mb-4" />
                <div className="flex items-center justify-between text-sm">
                    <span>$0</span>
                    <span>$2000+</span>
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="font-semibold mb-3">Customer Rating</h3>
                <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox id={`rating-${rating}`} />
                            <Label htmlFor={`rating-${rating}`} className="flex items-center text-sm font-normal cursor-pointer">
                                <div className="flex mr-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                & Up
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
