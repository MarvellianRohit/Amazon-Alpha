"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, ExternalLink } from "lucide-react";
import Image from "next/image";

const DEALS = [
    { id: 1, title: "MacBook Pro M3", discount: "15% OFF", price: "$1449", original: "$1699", image: "/placeholder.jpg" },
    { id: 2, title: "iPad Air 5", discount: "10% OFF", price: "$549", original: "$599", image: "/placeholder.jpg" },
    { id: 3, title: "Sony WH-1000XM5", discount: "20% OFF", price: "$320", original: "$400", image: "/placeholder.jpg" },
    { id: 4, title: "Logitech MX Master 3S", discount: "10% OFF", price: "$90", original: "$100", image: "/placeholder.jpg" },
];

export function SpecialDealsGrid() {
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-700">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-300">
                <Tag className="w-6 h-6" />
                Exclusive verified Deals
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {DEALS.map((deal) => (
                    <Card key={deal.id} className="bg-white/10 border-white/10 text-white backdrop-blur-md overflow-hidden hover:bg-white/20 transition-all cursor-pointer group">
                        <div className="h-40 bg-gray-900/50 relative">
                            {/* Placeholder for Image */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                Product Image
                            </div>
                            <div className="absolute top-2 right-2">
                                <Badge className="bg-red-500 hover:bg-red-600 border-none">{deal.discount}</Badge>
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg group-hover:text-amber-300 transition-colors">{deal.title}</h3>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-xl font-bold text-white">{deal.price}</span>
                                <span className="text-sm text-gray-400 line-through">{deal.original}</span>
                            </div>
                            <Button size="sm" variant="secondary" className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white border-none">
                                View Deal <ExternalLink className="w-3 h-3 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
