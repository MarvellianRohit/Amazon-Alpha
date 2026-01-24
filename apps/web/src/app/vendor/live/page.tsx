"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Video, Mic, MessageSquare, Users, Radio } from "lucide-react";

export default function VendorLiveStreamPage() {
    const [isStreaming, setIsStreaming] = useState(false);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Live Commerce Studio</h1>
                {isStreaming && (
                    <div className="flex items-center gap-2 text-red-500 animate-pulse">
                        <Radio className="w-4 h-4" />
                        <span className="font-bold">LIVE ON AIR</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Preview Area */}
                <div className="lg:col-span-2">
                    <div className="aspect-video bg-black rounded-2xl relative overflow-hidden flex items-center justify-center border border-neutral-800 shadow-2xl">
                        {!isStreaming ? (
                            <div className="text-center">
                                <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Video className="w-8 h-8 text-neutral-400" />
                                </div>
                                <h3 className="text-xl text-neutral-300 font-medium">Stream Offline</h3>
                                <p className="text-neutral-500 mb-6">Setup your camera and microphone to start selling.</p>
                                <Button size="lg" onClick={() => setIsStreaming(true)} className="bg-red-600 hover:bg-red-700">
                                    Go Live Now
                                </Button>
                            </div>
                        ) : (
                            <div className="relative w-full h-full">
                                {/* Fake camera feed placeholder */}
                                <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                                    <span className="text-neutral-600 font-mono">CAMERA FEED SIMULATION</span>
                                </div>

                                {/* Overlay Controls */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                                    <Button variant="secondary" size="icon" className="rounded-full h-12 w-12"><Mic className="w-5 h-5" /></Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setIsStreaming(false)}
                                        className="rounded-full px-6"
                                    >
                                        End Stream
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Chat & Stats */}
                <div className="space-y-6">
                    {/* Stats Card */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm">
                        <h4 className="font-semibold text-sm text-neutral-500 uppercase mb-4">Real-time Insight</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-2xl font-bold">0</div>
                                <div className="text-xs text-neutral-500 flex items-center gap-1"><Users className="w-3 h-3" /> Viewers</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">$0.00</div>
                                <div className="text-xs text-neutral-500">Revenue</div>
                            </div>
                        </div>
                    </div>

                    {/* Live Chat Mock */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm h-[400px] flex flex-col">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Live Chat
                        </h4>
                        <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-neutral-50 dark:bg-neutral-950/50 rounded-lg mb-2">
                            <p className="text-xs text-neutral-500 italic text-center mt-10">Chat is empty. Waiting for viewers...</p>
                        </div>
                        <input className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-800 p-2 text-sm outline-none" placeholder="Reply to chat..." />
                    </div>
                </div>
            </div>
        </div>
    );
}
