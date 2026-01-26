"use client";

import { HolodeckScene } from "@/components/holodeck/holodeck-scene";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cpu, Box } from "lucide-react";
import Link from "next/link";
import { useSupernovaStore } from "@/store/supernova-store";
import { useEffect } from "react";

export default function HolodeckPage() {
    const { activeProductId } = useSupernovaStore();

    // Optional: Reset or handle state on mount
    useEffect(() => {
        console.log("Supernova initialized with product:", activeProductId);
    }, [activeProductId]);

    return (
        <main className="w-screen h-screen relative overflow-hidden bg-black">
            <HolodeckScene />

            {/* UI Overlay */}
            <div className="absolute top-0 left-0 p-8 z-50 pointer-events-none">
                <div className="pointer-events-auto mb-4">
                    <Button variant="outline" size="icon" asChild className="rounded-full bg-black/50 backdrop-blur border-white/20 text-white hover:bg-white/20">
                        <Link href="/">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                </div>
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse tracking-tighter">
                        PROJECT <br /> SUPERNOVA
                    </h1>
                    <div className="flex flex-col gap-2 items-start">
                        <div className="flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-widest bg-black/50 backdrop-blur w-fit px-2 py-1 border border-red-500/30 rounded">
                            <Cpu className="w-3 h-3 animate-spin" /> High Performance Mode
                        </div>
                        {activeProductId && (
                            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-widest bg-indigo-950/50 backdrop-blur w-fit px-2 py-1 border border-indigo-500/30 rounded animate-in fade-in slide-in-from-left-4">
                                <Box className="w-3 h-3" /> Inspecting Product: {activeProductId}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 right-8 z-50 text-right pointer-events-none">
                <p className="text-white/30 text-xs font-mono">
                    RENDERER: WEBGL 2.0 <br />
                    PHYSICS: CANNON-ES <br />
                    POST: BLOOM + CHROMATIC
                </p>
            </div>
        </main>
    );
}
