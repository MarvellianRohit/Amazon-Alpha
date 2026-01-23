"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Returns & Refunds</h1>
                        <p className="text-muted-foreground">Our commitment to your satisfaction.</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Return Policy</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm leading-relaxed">
                            <p>
                                We want you to be completely happy with your purchase. If you are not satisfied, you can return most items within 30 days of delivery for a full refund.
                            </p>
                            <h3 className="font-semibold text-base mt-4">Conditions</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Items must be unused and in original condition.</li>
                                <li>Original packaging and tags must be intact.</li>
                                <li>Digital assets and NFTs are non-refundable once transferred.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>How to Start a Return</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ol className="list-decimal pl-5 space-y-2 text-sm">
                                <li>Go to your <strong><Link href="/account/orders" className="text-primary underline">Order History</Link></strong>.</li>
                                <li>Select the order containing the item you wish to return.</li>
                                <li>Click "Request Return" and follow the instructions to print your shipping label.</li>
                                <li>Pack the item securely and drop it off at any authorized carrier location.</li>
                            </ol>
                            <div className="pt-4">
                                <Link href="/account/orders">
                                    <Button>Go to My Orders</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
