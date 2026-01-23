"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <div className="bg-indigo-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search for articles, topics..."
                            className="pl-10 h-11 bg-white text-slate-900 border-none"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="grid gap-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Common Questions</h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Where is my order?</AccordionTrigger>
                                <AccordionContent>
                                    You can track your order by logging into your account and visiting the "Orders" section. We also send email updates at every step of the shipping process.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                                <AccordionContent>
                                    Go to the login page and click "Forgot Password". Follow the instructions sent to your email to create a new password.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                                <AccordionContent>
                                    We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and selected cryptocurrencies via our blockchain integration.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger>How does the "Digital Twin" NFT work?</AccordionTrigger>
                                <AccordionContent>
                                    Premium items come with a Digital Twin NFT on the Polygon network. This proves ownership and authenticity. You can view it in your Wallet section after purchase.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    <section className="text-center pt-8 border-t">
                        <h3 className="text-xl font-semibold mb-4">Still need support?</h3>
                        <div className="flex justify-center gap-4">
                            <Link href="/contact">
                                <Button>Contact Support</Button>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
