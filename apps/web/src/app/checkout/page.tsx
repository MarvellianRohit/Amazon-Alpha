"use client";

import { useCart } from "@/hooks/use-cart";
import { Loader2, Truck, Package, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentForm, MockPaymentForm } from "@/components/checkout/payment-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Initialize Stripe (It will be null if key is missing, handled gracefully)
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null;

type ShipmentGroup = {
    vendorId: string;
    vendorName: string;
    items: any[];
    deliveryDate: string;
    cost: number;
}

export default function CheckoutPage() {
    const { cart, isLoading } = useCart();
    const [shipments, setShipments] = useState<ShipmentGroup[]>([]);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

    // Group items by Vendor when cart loads
    useEffect(() => {
        if (!cart?.items) return;

        const groups: Record<string, ShipmentGroup> = {};

        cart.items.forEach(item => {
            const vId = item.product.vendor_id || 'unknown';
            const vName = item.product.vendor_name || 'Vendor';

            if (!groups[vId]) {
                const date = new Date();
                date.setDate(date.getDate() + 3 + Math.floor(Math.random() * 5)); // Random date 3-8 days out

                groups[vId] = {
                    vendorId: vId,
                    vendorName: vName,
                    items: [],
                    deliveryDate: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                    cost: 5.99 // Base shipping per shipment
                };
            }
            groups[vId].items.push(item);
        });

        setShipments(Object.values(groups));

        // In a real app, we would CreatePaymentIntent here and setClientSecret
        // For now, if we have a key, we'd fetch it. If not, we stay null (mock mode).
        if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
            // Mock fetching a client secret
            setClientSecret("pi_mock_secret_123");
        }

    }, [cart]);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    if (isPaymentSuccess) {
        return (
            <div className="container mx-auto p-4 max-w-2xl text-center py-20">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
                <p className="text-muted-foreground mb-8">
                    Your order has been split into <strong>{shipments.length} shipments</strong> and will be with you shortly.
                </p>
                <div className="grid gap-4 text-left">
                    {shipments.map((shipment, i) => (
                        <Card key={i}>
                            <CardContent className="pt-6 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-sm text-muted-foreground">Shipment {i + 1} of {shipments.length}</p>
                                    <p className="font-medium">Sold by {shipment.vendorName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-green-600 font-bold">Arriving {shipment.deliveryDate}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    const totalShipping = shipments.reduce((acc, curr) => acc + curr.cost, 0);
    const subtotal = cart?.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) || 0;
    const total = subtotal + totalShipping;

    return (
        <div className="container mx-auto p-4 grid gap-8 lg:grid-cols-3">
            {/* LEFT COLUMN: Shipping & Items */}
            <div className="lg:col-span-2 space-y-6">
                <h1 className="text-2xl font-bold">Checkout</h1>

                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Truck className="w-5 h-5" /> Shipping Details
                </h2>

                {shipments.map((shipment, index) => (
                    <Card key={shipment.vendorId} className="border-l-4 border-l-orange-400">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex justify-between items-center">
                                <span>Shipment {index + 1} of {shipments.length}</span>
                                <Badge variant="outline">{shipment.vendorName}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center bg-muted/30 p-3 rounded-md">
                                <span className="text-sm font-medium">Estimated Delivery</span>
                                <span className="text-green-700 font-bold">{shipment.deliveryDate}</span>
                            </div>

                            <div className="space-y-3">
                                {shipment.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-md border flex items-center justify-center shrink-0">
                                            {item.product.images?.[0] ? (
                                                <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover rounded-md" />
                                            ) : (
                                                <Package className="w-8 h-8 text-gray-300" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm line-clamp-1">{item.product.name || item.product.title}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold">${item.product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <RadioGroup defaultValue="standard">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="standard" id={`std-${shipment.vendorId}`} />
                                    <Label htmlFor={`std-${shipment.vendorId}`} className="flex-1">Standard Shipping</Label>
                                    <span className="text-sm">${shipment.cost.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-muted-foreground">
                                    <RadioGroupItem value="express" id={`exp-${shipment.vendorId}`} disabled />
                                    <Label htmlFor={`exp-${shipment.vendorId}`} className="flex-1">Express (Not Available)</Label>
                                    <span className="text-sm">--</span>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* RIGHT COLUMN: Summary & Payment */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="sticky top-4">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Items ({cart?.items.length})</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping (Split)</span>
                            <span>${totalShipping.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Order Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <Separator />

                        <div className="pt-4">
                            <h3 className="font-semibold mb-3">Payment Method</h3>
                            {(clientSecret && stripePromise) ? (
                                <Elements stripe={stripePromise} options={{ clientSecret }}>
                                    <PaymentForm clientSecret={clientSecret} onSuccess={() => setIsPaymentSuccess(true)} />
                                </Elements>
                            ) : (
                                <MockPaymentForm onSuccess={() => setIsPaymentSuccess(true)} />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
