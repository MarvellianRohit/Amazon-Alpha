'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, DollarSign } from "lucide-react";

interface Message {
    sender: 'user' | 'vendor_agent';
    content: string;
    offer_price?: number;
}

export function NegotiationChat({ productId, initialPrice }: { productId: string, initialPrice: number }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(initialPrice);
    const wsRef = useRef<WebSocket | null>(null);
    const [negotiationId, setNegotiationId] = useState<string | null>(null);

    // 1. Start Negotiation Session
    useEffect(() => {
        const startSession = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/v1/ws/negotiate/start?user_id=mock-user&product_id=${productId}&initial_price=${initialPrice}`, {
                    method: 'POST'
                });
                const data = await res.json();
                setNegotiationId(data.negotiation_id);
            } catch (e) {
                console.error("Failed to start negotiation", e);
            }
        };
        startSession();
    }, [productId, initialPrice]);

    // 2. Connect WebSocket when ID is ready
    useEffect(() => {
        if (!negotiationId) return;

        const ws = new WebSocket(`ws://localhost:8000/api/v1/ws/negotiate/${negotiationId}`);

        ws.onopen = () => {
            setIsConnected(true);
            setMessages([{ sender: 'vendor_agent', content: `Hello! I see you're interested. The current price is $${currentPrice}. How can I help?` }]);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // data: { sender, content, offer_price, type }
            setMessages(prev => [...prev, {
                sender: data.sender,
                content: data.content,
                offer_price: data.offer_price
            }]);

            if (data.offer_price) {
                setCurrentPrice(data.offer_price);
            }
        };

        wsRef.current = ws;

        return () => {
            ws.close();
        };
    }, [negotiationId]);

    const sendMessage = () => {
        if (!input.trim() || !wsRef.current) return;

        wsRef.current.send(JSON.stringify({
            type: "message",
            content: input
        }));

        // Optimistic update handled by broadcast echo or separate local add
        setInput("");
    };

    return (
        <Card className="w-full h-[500px] flex flex-col shadow-xl">
            <CardHeader className="bg-indigo-600 text-white py-3">
                <CardTitle className="flex justify-between items-center text-lg">
                    <span className="flex items-center gap-2">
                        <Bot className="w-5 h-5" /> Negotiation Room
                    </span>
                    <span className="font-bold bg-white/20 px-3 py-1 rounded-full text-base">
                        ${currentPrice.toFixed(2)}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden relative">
                <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.sender === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                                    }`}>
                                    {m.content}
                                    {m.offer_price && (
                                        <div className="mt-2 bg-white/50 p-2 rounded text-center font-bold border border-white/20">
                                            Offer: ${m.offer_price}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-3 border-t bg-slate-50">
                <form
                    className="flex w-full gap-2"
                    onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type offer or ask a question..."
                        disabled={!isConnected}
                        className="bg-white"
                    />
                    <Button type="submit" disabled={!isConnected} size="icon" className="bg-indigo-600">
                        <DollarSign className="w-4 h-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
