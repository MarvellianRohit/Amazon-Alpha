"use client";

import { DeviceFrame } from "@/components/simulator/device-frame";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Smartphone, Tablet, RotateCcw, Monitor } from "lucide-react";
import { useState } from "react";

export default function SimulatorPage() {
    const [device, setDevice] = useState<"iphone" | "pixel" | "samsung-tab">("iphone");
    const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
    const [scale, setScale] = useState([0.8]);

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
                        <Smartphone className="w-4 h-4 mr-2" /> iPhone 15
                    </Button>
                    <Button
                        variant={device === "pixel" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setDevice("pixel")}
                        className="text-white"
                    >
                        <Tablet className="w-4 h-4 mr-2" /> Pixel 8
                    </Button>
                    <Button
                        variant={device === "samsung-tab" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setDevice("samsung-tab")}
                        className="text-white"
                    >
                        <Monitor className="w-4 h-4 mr-2" /> Tab S11 Ultra
                    </Button>
                </div>

                <div className="w-px h-8 bg-slate-700" />

                {/* Orientation */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setOrientation(prev => prev === "portrait" ? "landscape" : "portrait")}
                    className="border-slate-600 hover:bg-slate-800 text-white"
                >
                    <RotateCcw className="w-4 h-4" />
                </Button>

                {/* Scale Slider */}
                <div className="flex items-center gap-3 w-40">
                    <Monitor className="w-4 h-4 text-slate-400" />
                    <Slider
                        value={scale}
                        min={0.5}
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
                />
            </div>

            <div className="fixed top-8 left-8 text-white/50 text-sm font-mono">
                Running in {device === "iphone" ? "iOS Simulator" : device === "pixel" ? "Android Simulator" : "Tablet Simulator"} Mode
            </div>
        </div>
    );
}
