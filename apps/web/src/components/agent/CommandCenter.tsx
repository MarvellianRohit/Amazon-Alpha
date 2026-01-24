"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export function CommandCenter({ onCommand }: { onCommand: (cmd: string) => void }) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onCommand(input);
            setInput("");
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-neutral-900 border border-neutral-700 rounded-2xl p-2 flex items-center shadow-2xl">
                    <div className="p-3">
                        <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                    </div>
                    <input
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full bg-transparent text-lg text-white placeholder-neutral-500 focus:outline-none px-2"
                        placeholder="Tell me what you need to achieve..."
                    />
                    <Button type="submit" size="icon" className="bg-white text-black hover:bg-neutral-200 rounded-xl h-10 w-10">
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </div>
            </form>
            <div className="flex justify-center gap-4 mt-4 text-xs text-neutral-500">
                <span className="cursor-pointer hover:text-indigo-400 transition-colors">"Find a birthday gift for dad under $50"</span>
                <span className="cursor-pointer hover:text-indigo-400 transition-colors">"Restock my coffee supply"</span>
            </div>
        </div>
    );
}
