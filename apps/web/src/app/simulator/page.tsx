"use client";

import { DeviceFrame } from "@/components/simulator/device-frame";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Smartphone, Tablet, RotateCcw, Monitor, Scan, Box, Share2 } from "lucide-react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/lib/mock-data";
import { Product3DViewer } from "@/components/product/product-3d-viewer";

function SimulatorContent() {
    const searchParams = useSearchParams();
    const productId = searchParams.get("productId");
    const [device, setDevice] = useState<"iphone" | "pixel" | "samsung-tab">("iphone");
    const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
    const [scale, setScale] = useState([0.8]);

    const product = PRODUCTS.find(p => p.id === productId);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 overflow-hidden relative">

            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Controls Toolbar */}
            <div className="fixed bottom-8 z-50 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-2xl flex items-center gap-6 shadow-2xl">

                {/* Device Switcher */}
                <div className="flex bg-slate-800 rounded-lg p-1">
                    <Button
                        variant={device === "iphone" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setDevice("iphone")}
                        className="text-white"
                    >
                        <Smartphone className="w-4 h-4 mr-2" /> iPhone
                    </Button>
                    <Button
                        variant={device === "pixel" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setDevice("pixel")}
                        className="text-white"
                    >
                        <Tablet className="w-4 h-4 mr-2" /> Pixel
                    </Button>
                    <Button
                        variant={device === "samsung-tab" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setDevice("samsung-tab")}
                        className="text-white"
                    >
                        <Monitor className="w-4 h-4 mr-2" /> Tab
                    </Button>
                </div>

                <div className="w-px h-8 bg-slate-700" />

                {/* Lab Actions */}
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-slate-700 text-indigo-400">
                        <Scan className="w-4 h-4 mr-2" /> Scan AR
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-700 text-indigo-400">
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>

                {/* Scale Slider */}
                <div className="flex items-center gap-3 w-40">
                    <Monitor className="w-4 h-4 text-slate-400" />
                    <Slider
                        value={scale}
                        min={0.4}
                        max={1.2}
                        step={0.1}
                        onValueChange={setScale}
                        className="cursor-grab"
                    />
                </div>
            </div>

            {/* Device Stage */}
            <div className="relative z-10 flex items-center justify-center min-h-[800px] w-full transition-all">
                <DeviceFrame
                    device={device}
                    orientation={orientation}
                    scale={scale[0]}
                    url="/"
                >
                    {product ? (
                        <div className="w-full h-full bg-black">
                            <Product3DViewer
                                productImage={product.image}
                                productName={product.name}
                                color="#6366f1"
                            />
                        </div>
                    ) : null}
                </DeviceFrame>
            </div>

            <div className="fixed top-8 left-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Box className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-white font-black text-xl tracking-tight">ALPHA <span className="text-indigo-500">HOLODECK</span></h2>
                    <p className="text-indigo-400/50 text-[10px] font-mono uppercase tracking-widest leading-none">Scanning Active // Product Visualizer</p>
                </div>
            </div>
        </div>
    );
}

export default function SimulatorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-mono animate-pulse">Initializing Lab Environment...</div>}>
            <SimulatorContent />
        </Suspense>
    );
}
