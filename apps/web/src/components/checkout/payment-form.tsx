"use client";

import { useState, useEffect } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

export function PaymentForm({ clientSecret, onSuccess }: { clientSecret: string, onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/success`,
            },
            redirect: 'if_required'
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message || "An unexpected error occurred.");
            } else {
                setMessage("An unexpected error occurred.");
            }
            setIsLoading(false);
        } else {
            // Success
            toast.success("Payment successful!");
            onSuccess();
            setIsLoading(false);
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

            {message && <div className="text-red-500 text-sm">{message}</div>}

            <Button disabled={isLoading || !stripe || !elements} className="w-full">
                {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                    <><CreditCard className="w-4 h-4 mr-2" /> Pay Now</>
                )}
            </Button>
        </form>
    );
}

export function MockPaymentForm({ onSuccess }: { onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleMockPay = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
        toast.success("Mock Payment successful!");
        setIsLoading(false);
        onSuccess();
    }

    return (
        <div className="border p-4 rounded-md bg-muted/20">
            <h3 className="font-semibold mb-2">Test Mode Payment</h3>
            <p className="text-sm text-muted-foreground mb-4">Stripe keys are not configured. This is a simulation.</p>
            <div className="space-y-4">
                <div className="h-10 bg-white border rounded px-3 flex items-center text-sm text-gray-500">
                    **** **** **** 4242
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 bg-white border rounded px-3 flex items-center text-sm text-gray-500">
                        12 / 24
                    </div>
                    <div className="h-10 bg-white border rounded px-3 flex items-center text-sm text-gray-500">
                        123
                    </div>
                </div>
                <Button onClick={handleMockPay} disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                    ) : (
                        "Simulate Payment"
                    )}
                </Button>
            </div>
        </div>
    )
}
