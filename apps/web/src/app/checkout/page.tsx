
"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Lock, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const router = useRouter();

    const handlePlaceOrder = () => {
        // Trigger Confetti
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        toast.success("Order Placed Successfully! (Simulation)");

        // Redirect after delay
        setTimeout(() => {
            router.push('/account/orders');
        }, 3000);
    };
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div className="space-y-6">
                        {/* Shipping Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first-name">First Name</Label>
                                        <Input id="first-name" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last-name">Last Name</Label>
                                        <Input id="last-name" placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" placeholder="123 Main St" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2 col-span-1">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" placeholder="New York" />
                                    </div>
                                    <div className="space-y-2 col-span-1">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" placeholder="NY" />
                                    </div>
                                    <div className="space-y-2 col-span-1">
                                        <Label htmlFor="zip">Zip</Label>
                                        <Input id="zip" placeholder="10001" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <RadioGroup defaultValue="card">
                                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                                        <RadioGroupItem value="card" id="card" />
                                        <Label htmlFor="card" className="flex-1 flex items-center justify-between cursor-pointer">
                                            <span className="flex items-center"><CreditCard className="w-4 h-4 mr-2" /> Credit Card</span>
                                            <div className="flex space-x-1">
                                                <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                                <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                            </div>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                                        <RadioGroupItem value="crypto" id="crypto" />
                                        <Label htmlFor="crypto" className="flex-1 flex items-center justify-between cursor-pointer">
                                            <span className="flex items-center"><Lock className="w-4 h-4 mr-2 text-purple-600" /> Crypto (ETH/Polygon)</span>
                                            <span className="text-xs text-muted-foreground">Web3 Wallet</span>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                <div className="space-y-2 pt-4">
                                    <Label>Card Information</Label>
                                    <Input placeholder="0000 0000 0000 0000" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="MM/YY" />
                                        <Input placeholder="CVC" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-slate-900 text-white border-none">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between">
                                        <span>Items (3)</span>
                                        <span>$537.99</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>$43.04</span>
                                    </div>
                                    <Separator className="bg-white/10" />
                                    <div className="flex justify-between text-2xl font-bold text-white">
                                        <span>Total</span>
                                        <span>$581.03</span>
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full mt-8 bg-green-500 hover:bg-green-600 text-white font-bold"
                                    onClick={handlePlaceOrder}
                                >
                                    Place Order
                                </Button>
                                <div className="mt-4 flex items-center justify-center text-xs text-white/60">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    100% Secure Payment
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    )
}
