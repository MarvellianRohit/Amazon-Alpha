
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { CART_ITEMS } from "@/lib/mock-data"
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react"
import { Price } from "@/components/ui/price"

export default function CartPage() {
    const subtotal = CART_ITEMS.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const tax = subtotal * 0.08
    const total = subtotal + tax

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {CART_ITEMS.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="p-4 flex gap-4">
                                    <div className="relative h-24 w-24 flex-shrink-0 bg-slate-100 dark:bg-slate-900 rounded-md">
                                        <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-2" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold line-clamp-1">{item.product.name}</h3>
                                                <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                                                    In Stock
                                                </p>
                                                {item.product.isDigitalTwin && (
                                                    <div className="flex items-center text-xs text-purple-600 mt-1">
                                                        <ShieldCheck className="w-3 h-3 mr-1" /> NFT Verified
                                                    </div>
                                                )}
                                            </div>
                                            <div className="font-bold text-lg"><Price amount={item.product.price} /></div>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center space-x-2">
                                                <Button variant="outline" size="icon" className="h-8 w-8">
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                <Button variant="outline" size="icon" className="h-8 w-8">
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4 mr-2" /> Remove
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Summary */}
                    <div>
                        <Card className="sticky top-20">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <Price amount={subtotal} />
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Shipping & Handling</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Tax (8%)</span>
                                        <Price amount={tax} />
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <Price amount={total} />
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <Link href="/checkout">
                                        <Button className="w-full" size="lg">
                                            Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <p className="text-xs text-center text-muted-foreground">
                                        Secure transaction powered by Stripe & Polygon
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
