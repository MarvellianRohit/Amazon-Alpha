"use client";

import { Button } from "@/components/ui/button";
import { Heart, Share2, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function LiveStreamPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto max-w-6xl p-4 lg:p-8">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
                    {/* Player Area */}
                    <div className="lg:col-span-2 relative bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 border-2 border-white" />
                            <div>
                                <h3 className="font-bold shadow-black drop-shadow-md">TechReviewPro</h3>
                                <div className="text-xs bg-red-600 px-2 py-0.5 rounded text-white inline-block">LIVE</div>
                            </div>
                        </div>

                        {/* Video Placeholder */}
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                            <div className="text-center opacity-50">
                                <h1 className="text-4xl font-black mb-2 tracking-tighter">FUTURE TECH LAUNCH</h1>
                                <p>Stream starting shortly...</p>
                            </div>
                        </div>

                        {/* Reaction Bar */}
                        <div className="absolute bottom-6 right-6 flex flex-col gap-4">
                            <Button size="icon" className="rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 w-12 h-12 border-none">
                                <Heart className="w-6 h-6 text-pink-500" />
                            </Button>
                            <Button size="icon" className="rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 w-12 h-12 border-none">
                                <Share2 className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar: Products & Chat */}
                    <div className="flex flex-col gap-4">
                        {/* Featured Product */}
                        <div className="bg-white text-black p-4 rounded-xl shadow-lg animate-in slide-in-from-right fade-in duration-700">
                            <div className="text-xs font-bold text-red-600 mb-2 uppercase tracking-wide">Featured Now</div>
                            <div className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-neutral-100 rounded-lg flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-sm line-clamp-1">Sony WH-1000XM5</h4>
                                    <div className="text-lg font-black">$348 <span className="text-sm font-normal text-gray-400 line-through">$399</span></div>
                                </div>
                            </div>
                            <Button className="w-full mt-3 bg-black text-white hover:bg-neutral-800">
                                <ShoppingBag className="w-4 h-4 mr-2" /> Buy Now
                            </Button>
                        </div>

                        {/* Chat Area (Simplified) */}
                        <div className="flex-1 bg-neutral-900 rounded-xl border border-neutral-800 p-4 flex flex-col">
                            <h3 className="font-bold border-b border-neutral-800 pb-2 mb-2">Live Chat</h3>
                            <div className="flex-1 overflow-auto space-y-3 mask-image-b">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="text-sm">
                                        <span className="font-bold text-neutral-400">User{i}:</span> <span className="text-neutral-200">Checking in from NY! 🔥</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2">
                                <input className="w-full bg-neutral-800 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20" placeholder="Say something..." />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
