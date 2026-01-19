'use client';

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { Star, ShoppingCart, GraduationCap, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider"; // Assuming auth provider exists
import { cn } from "@/lib/utils";
import { ProductQuickLook } from "@/components/products/product-quick-look";

interface ProductResultCardProps {
    product: Product;
}

export function ProductResultCard({ product }: ProductResultCardProps) {
    // Mock Auth / Student Status check
    // In real app, useAuth() hook
    const isStudentVerified = typeof window !== 'undefined' ? localStorage.getItem('is_student_verified') === 'true' : false;

    // Calculate discount percentage if student price exists
    const discountPercent = product.studentPrice
        ? Math.round(((product.price - product.studentPrice) / product.price) * 100)
        : 0;

    return (
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-slate-200">
            <CardHeader className="p-0 relative bg-muted aspect-[4/3]">
                {/* Responsive Quick Look Wrapper */}
                <ProductQuickLook product={product}>
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/20 relative">
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <span className="text-gray-400">No Image</span>
                        )}
                    </div>
                </ProductQuickLook>

                {/* Stock Badge */}
                {product.stock < 10 && (
                    <Badge variant="destructive" className="absolute top-2 right-2 shadow-sm">
                        Low Stock
                    </Badge>
                )}

                {/* Student Discount Badge (Visible if verified) */}
                {isStudentVerified && product.studentPrice && (
                    <Badge className="absolute top-2 left-2 bg-green-600 hover:bg-green-700 shadow-sm flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        -{discountPercent}% Student Deal
                    </Badge>
                )}
            </CardHeader>

            <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em]">
                            {product.description}
                        </p>
                    </div>
                </div>

                {/* Ratings */}
                <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">(120)</span>
                </div>

                {/* Pricing Area */}
                <div className="flex flex-col gap-1">
                    {isStudentVerified && product.studentPrice ? (
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground line-through">
                                ${product.price.toFixed(2)}
                            </span>
                            <div className="flex items-center gap-2 text-green-700 font-bold text-lg">
                                ${product.studentPrice.toFixed(2)}
                                <span className="text-[10px] font-normal uppercase tracking-wide bg-green-100 px-1.5 py-0.5 rounded">
                                    Student Price
                                </span>
                            </div>
                        </div>
                    ) : product.studentPrice ? (
                        // Not Verified but Student Price Exists -> Teaser
                        <div className="space-y-1">
                            <div className="font-bold text-lg text-slate-900">
                                ${product.price.toFixed(2)}
                            </div>
                            <Link href="/student/verify" className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium hover:underline">
                                <Lock className="w-3 h-3" />
                                Verify ID to save ${(product.price - product.studentPrice).toFixed(2)}
                            </Link>
                        </div>
                    ) : (
                        // Regular Price Only
                        <div className="font-bold text-lg text-slate-900">
                            ${product.price.toFixed(2)}
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white" size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    )
}
// Export alias for compatibility
export { ProductResultCard as ProductCard };
