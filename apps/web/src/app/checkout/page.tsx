"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Lock, CheckCircle2, Loader2, PartyPopper } from "lucide-react"
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Price } from "@/components/ui/price";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
    const router = useRouter();
    const { cart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const items = cart?.items || [];
    const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const handlePlaceOrder = () => {
        setIsProcessing(true);

        // Simulate network delay
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);

            // Trigger Confetti
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

            const randomInRange = (min: number, max: number) => {
                return Math.random() * (max - min) + min;
            }

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            toast.success("Order Placed Successfully!");

            // Redirect after delay
            setTimeout(() => {
                router.push('/');
            }, 4000);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 relative">
            <AnimatePresence>
                {(isProcessing || isSuccess) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="relative">
                                        <Loader2 className="w-16 h-16 mx-auto text-indigo-500 animate-spin" />
                                        <div className="absolute inset-0 blur-xl bg-indigo-500/20 rounded-full" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Processing Order</h2>
                                    <p className="text-muted-foreground">Verifying payment with Amazon-Alpha Secure...</p>
                                </>
                            ) : (
                                <>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", damping: 10 }}
                                    >
                                        <PartyPopper className="w-16 h-16 mx-auto text-green-500" />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold">Confirmed!</h2>
                                    <p className="text-muted-foreground">Thank you for your purchase. Redirecting you home...</p>
                                    <Button onClick={() => router.push('/')} variant="outline" className="w-full">Go Now</Button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <Link href="/cart" className="text-sm text-muted-foreground hover:text-indigo-600 flex items-center gap-1">
                        ← Back to Cart
                    </Link>
                    <h1 className="text-4xl font-black mt-2 tracking-tight">Final Step</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {/* Shipping Info */}
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</div>
                                    Shipping Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first-name">First Name</Label>
                                        <Input id="first-name" placeholder="John" className="bg-slate-50 dark:bg-slate-800/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last-name">Last Name</Label>
                                        <Input id="last-name" placeholder="Doe" className="bg-slate-50 dark:bg-slate-800/50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" placeholder="123 Main St" className="bg-slate-50 dark:bg-slate-800/50" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2 col-span-1">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" placeholder="New York" className="bg-slate-50 dark:bg-slate-800/50" />
                                    </div>
                                    <div className="space-y-2 col-span-1">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" placeholder="NY" className="bg-slate-50 dark:bg-slate-800/50" />
                                    </div>
                                    <div className="space-y-2 col-span-1">
                                        <Label htmlFor="zip">Zip</Label>
                                        <Input id="zip" placeholder="10001" className="bg-slate-50 dark:bg-slate-800/50" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Info */}
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</div>
                                    Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <RadioGroup defaultValue="card">
                                    <div className="flex items-center space-x-2 border-2 border-slate-100 dark:border-slate-800 p-4 rounded-xl hover:border-indigo-500 transition-colors">
                                        <RadioGroupItem value="card" id="card" />
                                        <Label htmlFor="card" className="flex-1 flex items-center justify-between cursor-pointer">
                                            <span className="flex items-center font-medium"><CreditCard className="w-4 h-4 mr-2" /> Credit Card</span>
                                            <div className="flex space-x-1 grayscale">
                                                <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                                <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                            </div>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border-2 border-slate-100 dark:border-slate-800 p-4 rounded-xl hover:border-indigo-500 transition-colors">
                                        <RadioGroupItem value="crypto" id="crypto" />
                                        <Label htmlFor="crypto" className="flex-1 flex items-center justify-between cursor-pointer">
                                            <span className="flex items-center font-medium"><Lock className="w-4 h-4 mr-2 text-purple-600" /> Crypto (ETH/Polygon)</span>
                                            <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">WEB3</span>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                <div className="space-y-2 pt-4">
                                    <Label>Card Information</Label>
                                    <Input placeholder="0000 0000 0000 0000" className="bg-slate-50 dark:bg-slate-800/50" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="MM/YY" className="bg-slate-50 dark:bg-slate-800/50" />
                                        <Input placeholder="CVC" className="bg-slate-50 dark:bg-slate-800/50" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-slate-900 dark:bg-slate-800 text-white border-none shadow-2xl sticky top-24">
                            <CardContent className="p-8">
                                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm text-slate-400">
                                            <span>{item.product.name} (x{item.quantity})</span>
                                            <span><Price amount={item.product.price * item.quantity} /></span>
                                        </div>
                                    ))}

                                    <Separator className="bg-white/10 my-4" />

                                    <div className="flex justify-between text-slate-300">
                                        <span>Subtotal</span>
                                        <span><Price amount={subtotal} /></span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Shipping</span>
                                        <span className="text-green-400 font-bold uppercase text-[10px]">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Tax (8%)</span>
                                        <span><Price amount={tax} /></span>
                                    </div>

                                    <Separator className="bg-white/10 my-4" />

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Amount</p>
                                            <p className="text-3xl font-black text-white leading-tight"><Price amount={total} /></p>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full mt-8 bg-indigo-500 hover:bg-indigo-600 h-14 text-lg font-black shadow-xl shadow-indigo-500/20 transition-all hover:-translate-y-1 active:translate-y-0"
                                    onClick={handlePlaceOrder}
                                    disabled={items.length === 0}
                                >
                                    {items.length === 0 ? "Cart is Empty" : "Confirm Purchase"}
                                </Button>
                                <div className="mt-6 flex items-center justify-center text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                    <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                                    Encrypted by AlphaCloud
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    )
}

