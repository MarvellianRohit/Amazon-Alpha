"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, Minimize2, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I am Amazon-Alpha AI. I have access to the entire system knowledge base. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:8000/api/v1/ai/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: userMsg })
            });
            const data = await res.json();

            if (data.answer) {
                setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: "I encountered an error accessing my memory." }]);
            }

        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "Connection Error. Is the backend running?" }]);
        } finally {
            setIsLoading(false);
        }
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
