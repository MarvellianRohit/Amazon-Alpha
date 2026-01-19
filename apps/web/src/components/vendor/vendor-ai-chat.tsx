"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Bot, Send, Sparkles, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

// Mock Vendor ID for prototype - in real app, get from Auth Context
const DEMO_VENDOR_ID = "00000000-0000-0000-0000-000000000000";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function VendorAIChat() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm your Business Consultant. I can analyze your sales data and products. How can I help you improve your business today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            // Call API
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/vendor/ai/consult`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: userMsg,
                    vendor_id: DEMO_VENDOR_ID
                })
            });

            if (!res.ok) throw new Error("Consultant is busy.");
            const data = await res.json();

            setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error accessing your business data." }]);
        }
        setLoading(false);
    };

    return (
        <Card className="h-[600px] flex flex-col shadow-lg border-indigo-100">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-white pb-4 border-b">
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                    <div className="bg-indigo-100 p-2 rounded-full">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                    </div>
                    Business Consultant AI
                </CardTitle>
                <p className="text-xs text-indigo-400 font-medium ml-1">Powered by Gemini 1.5 Pro</p>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" ref={scrollRef}>
                {messages.map((m, i) => (
                    <div key={i} className={cn("flex gap-3", m.role === 'user' ? "justify-end" : "justify-start")}>
                        {m.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div className={cn(
                            "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
                            m.role === 'user' ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white border rounded-tl-none text-slate-700"
                        )}>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <ReactMarkdown>
                                    {m.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                        {m.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-slate-600" />
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white border p-3 rounded-2xl rounded-tl-none">
                            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="p-3 border-t bg-white">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex w-full gap-2"
                >
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask about top products, returns, or strategy..."
                        className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                    />
                    <Button type="submit" disabled={loading || !input.trim()} size="icon" className="bg-indigo-600 hover:bg-indigo-700">
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
