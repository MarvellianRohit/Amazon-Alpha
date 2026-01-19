"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CartPage() {
    const { cart, isLoading, removeItem } = useCart()

    if (isLoading) {
        return <div className="container py-10">Loading Cart...</div>
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container py-10 text-center">
                <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                <Button asChild>
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        )
    }

    const total = cart.items.reduce((acc, item) => {
        return acc + (item.product ? item.product.price * item.quantity : 0)
    }, 0)

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                                        {/* Fallback image */}
                                        <span className="text-xs text-gray-400">Img</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{item.product?.title || 'Unknown Product'}</h3>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold mb-2">${(item.product?.price * item.quantity).toFixed(2)}</p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => removeItem.mutate(item.id)}
                                        disabled={removeItem.isPending}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between font-bold text-lg mb-4">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" asChild>
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
