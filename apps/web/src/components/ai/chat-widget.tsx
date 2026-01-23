/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, Minimize2, Sparkles, Loader2, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/lib/mock-data";
import { Price } from "@/components/ui/price";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

type Message = {
    role: "user" | "assistant";
    content: React.ReactNode;
};

export function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I am Amazon-Alpha AI. I have access to the entire system knowledge base. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { addItem } = useCart();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.toLowerCase();
        setMessages(prev => [...prev, { role: "user", content: input }]);
        setInput("");
        setIsLoading(true);

        // Simulated AI Thinking
        setTimeout(() => {
            let responseText = "I'm not sure about that. Try asking about electronics or my current offers!";
            let recommendations: any[] = [];

            if (userMsg.includes("laptop") || userMsg.includes("computer") || userMsg.includes("macbook")) {
                responseText = "I found several high-performance laptops for you. Our latest Pro Laptops are on sale!";
                recommendations = PRODUCTS.filter(p => p.category === "Electronics" && p.name.includes("Laptop")).slice(0, 2);
            } else if (userMsg.includes("headphone") || userMsg.includes("audio") || userMsg.includes("music")) {
                responseText = "Check out these premium headphones. The Alpha-Neo series offers noise cancellation.";
                recommendations = PRODUCTS.filter(p => p.category === "Electronics" && p.name.includes("Headphone")).slice(0, 2);
            } else if (userMsg.includes("shoe") || userMsg.includes("fashion") || userMsg.includes("wear")) {
                responseText = "I've picked out some trending shoes from our Fashion collection.";
                recommendations = PRODUCTS.filter(p => p.category === "Fashion" && (p.name.includes("Shoe") || p.name.includes("Kicks"))).slice(0, 2);
            } else if (userMsg.includes("hi") || userMsg.includes("hello") || userMsg.includes("hey")) {
                responseText = "Hello! I'm your AI shopping assistant. I can help you find products, track orders, or answer questions about our student club!";
            } else if (userMsg.includes("discount") || userMsg.includes("offer") || userMsg.includes("sale")) {
                responseText = "We have a 20% discount for all Student Club members. Just verify your ID!";
            }

            const responseContent = (
                <div className="flex flex-col gap-2">
                    <p>{responseText}</p>
                    {recommendations.length > 0 && (
                        <div className="flex flex-col gap-2 mt-1">
                            {recommendations.map((product) => (
                                <div key={product.id} className="bg-slate-50 border p-2 rounded-md flex gap-2 items-center hover:bg-slate-100 transition-colors cursor-pointer group">
                                    <div className="relative w-12 h-12 bg-white rounded-md overflow-hidden flex-shrink-0">
                                        <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold truncate group-hover:text-indigo-600 transition-colors">{product.name}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <div className="text-xs text-muted-foreground"><Price amount={product.price} /></div>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-6 w-6"
                                                onClick={() => {
                                                    addItem.mutate({ productId: product.id, quantity: 1 });
                                                    import('canvas-confetti').then(confetti => {
                                                        confetti.default({
                                                            particleCount: 100,
                                                            spread: 70,
                                                            origin: { y: 0.6 },
                                                            colors: ['#6366f1', '#a855f7', '#ec4899']
                                                        });
                                                    });
                                                    toast.success("Added to cart");
                                                }}
                                            >
                                                <ShoppingCart className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );

            setMessages(prev => [...prev, { role: "assistant", content: responseContent }]);
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* Toggle Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-xl hover:scale-110 transition-transform duration-300"
                >
                    <Bot className="w-8 h-8 text-white" />
                </Button>
            )}

            {/* Chat Window */}
            <div className={cn(
                "transition-all duration-300 transform origin-bottom-right",
                isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none absolute"
            )}>
                <Card className="w-[350px] md:w-[400px] h-[500px] flex flex-col border-2 border-purple-200 shadow-2xl">
                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-xl flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-300" />
                            <CardTitle className="text-lg">Amazon-Alpha AI</CardTitle>
                        </div>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6 text-white hover:bg-white/20">
                                <Minimize2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden bg-gray-50/50">
                        <ScrollArea className="h-full p-4">
                            <div className="space-y-4">
                                {messages.map((m, i) => (
                                    <div key={i} className={cn(
                                        "flex w-full",
                                        m.role === "user" ? "justify-end" : "justify-start"
                                    )}>
                                        <div className={cn(
                                            "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                                            m.role === "user"
                                                ? "bg-indigo-600 text-white rounded-br-none"
                                                : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                                        )}>
                                            {m.role === "assistant" && (
                                                <div className="mb-1 text-xs text-purple-600 font-bold flex items-center gap-1">
                                                    <Bot className="w-3 h-3" /> AI
                                                </div>
                                            )}
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white text-gray-500 rounded-2xl rounded-bl-none px-4 py-2 text-sm border border-gray-100 flex items-center gap-2">
                                            <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-3 bg-white border-t">
                        <form
                            className="flex w-full gap-2"
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        >
                            <Input
                                placeholder="Ask me anything..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="focus-visible:ring-purple-500"
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="shrink-0 bg-indigo-600 hover:bg-indigo-700">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
