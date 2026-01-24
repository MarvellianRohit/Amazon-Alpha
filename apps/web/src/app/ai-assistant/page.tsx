"use client";

import { VoiceAssistant } from "@/components/ai/VoiceAssistant";
import { Button } from "@/components/ui/button";
import { Mic, Navigation, Search, HelpCircle, Sparkles } from "lucide-react";

export default function AiAssistantPage() {
    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/30 to-black pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

            <div className="container mx-auto max-w-4xl px-4 py-20 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm font-medium mb-6 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>Next-Gen Voice Navigation</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                    Meet your personal <br /> shopping genius.
                </h1>

                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                    Just ask Genie to find products, compare prices, or navigate the store. It's hands-free and powered by advanced AI.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-20">
                    {[
                        { icon: Search, title: "Smart Search", desc: '"Find headphones under $200 with noise cancelling"' },
                        { icon: Navigation, title: "Navigation", desc: '"Take me to my recent orders"' },
                        { icon: HelpCircle, title: "Support", desc: '"How do I return my last item?"' },
                    ].map((item, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <item.icon className="w-8 h-8 text-indigo-400 mb-4" />
                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-400 italic">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-white/10 inline-block">
                    <div className="text-lg font-medium mb-4">Click the icon to start speaking</div>
                    {/* We render the component here for demo purposes, although it's usually fixed */}
                    <div className="relative h-24 w-24 mx-auto">
                        <VoiceAssistant />
                    </div>
                </div>
            </div>

            {/* Force mount the global assistant as well since it attaches to body/fixed */}
            <VoiceAssistant />
        </div>
    );
}
