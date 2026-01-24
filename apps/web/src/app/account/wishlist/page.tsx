"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ShoppingCart, Heart } from "lucide-react"
import { PRODUCTS } from "@/lib/mock-data"
import { Price } from "@/components/ui/price"

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState(PRODUCTS.slice(0, 3)) // Mock initial state with first 3 items

    const removeFromWishlist = (id: string) => {
        setWishlistItems((prev) => prev.filter((item) => item.id !== id))
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">My Wishlist</h1>
                    <p className="text-muted-foreground">
                        Save items for later. Prices and availability are subject to change.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    <span>{wishlistItems.length} items</span>
                </div>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed">
                    <Heart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
                    <p className="text-muted-foreground mb-6">Explore our catalog and find something you love.</p>
                    <Link href="/">
                        <Button>Start Shopping</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((product) => (
                        <Card key={product.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800">
                            <div className="aspect-[4/3] relative bg-white dark:bg-slate-800 p-8">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-4 right-4 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        removeFromWishlist(product.id)
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <CardContent className="p-6">
                                <Link href={`/product/${product.id}`}>
                                    <h3 className="font-bold text-lg mb-2 hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                                </Link>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-xl font-black">
                                        <Price amount={product.price} />
                                    </div>
                                    <Button size="sm" className="rounded-full gap-2">
                                        <ShoppingCart className="w-4 h-4" />
                                        Add to Cart
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
