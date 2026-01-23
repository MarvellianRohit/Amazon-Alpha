"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DeviceFrameProps {
    device: "iphone" | "pixel" | "samsung-tab";
    orientation: "portrait" | "landscape";
    scale?: number;
    url?: string;
    children?: React.ReactNode;
}

export function DeviceFrame({ device, orientation, scale = 1, url = "http://localhost:3000", children }: DeviceFrameProps) {
    const isPortrait = orientation === "portrait";

    // Dimensions
    // iPhone 15 Pro: 393 x 852
    // Pixel 8 Pro: 412 x 892
    // Samsung Tab S11 Ultra: 14.6" -> AspRatio ~16:10. Base w ~1000px
    const width = device === "iphone" ? 393 : device === "pixel" ? 412 : 1280;
    const height = device === "iphone" ? 852 : device === "pixel" ? 892 : 800;

    const frameWidth = isPortrait ? width : height;
    const frameHeight = isPortrait ? height : width;

    return (
        <motion.div
            layout
            className={cn(
                "relative bg-black shadow-2xl transition-all duration-500",
                device === "iphone" ? "border-[8px] border-slate-800 rounded-[3.5rem]" :
                    device === "pixel" ? "border-[8px] border-slate-900 rounded-[2rem]" :
                        "border-[6px] border-slate-950 rounded-[1rem]", // Tab S11 Ultra: Razor thin bezel
            )}
            style={{
                width: frameWidth,
                height: frameHeight,
                transform: `scale(${scale})`,
                transformOrigin: "center center"
            }}
        >
            {/* Bezel */}
            <div className="absolute inset-0 rounded-[2.5rem] border-[4px] border-black overflow-hidden bg-white">

                {/* Status Bar (Simulated) */}
                <div className="absolute top-0 left-0 right-0 h-14 z-40 flex justify-between items-start px-8 pt-3.5 text-black font-medium text-sm pointer-events-none select-none mix-blend-difference text-white">
                    <span>9:41</span>
                    <div className="flex gap-1.5 items-center">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L8.9 15.3c.13 2.57 2.13 4.63 2.1 4.63zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" /></svg>
                    </div>
                </div>

                {/* Notch / Dynamic Island */}
                {device === "iphone" && (
                    <div className={cn(
                        "absolute z-50 bg-black rounded-full left-1/2 -translate-x-1/2 transition-all duration-300",
                        isPortrait
                            ? "top-3 w-28 h-8"
                            : "top-1/2 -translate-y-1/2 -left-3 w-8 h-28"
                    )}>
                        {/* Camera lens hint */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-900/50" />
                    </div>
                )}

                {/* Punch hole for Pixel */}
                {device === "pixel" && (
                    <div className={cn(
                        "absolute z-50 bg-black rounded-full left-1/2 -translate-x-1/2 transition-all duration-300",
                        isPortrait
                            ? "top-4 w-4 h-4"
                            : "top-1/2 -translate-y-1/2 left-4 w-4 h-4"
                    )} />
                )}

                {/* Content */}
                {children ? (
                    <div className="w-full h-full pt-12">
                        {children}
                    </div>
                ) : (
                    <iframe
                        src={url}
                        className="w-full h-full border-none bg-white pt-12 pb-8"
                        title="Device Preview"
                    />
                )}

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-black/20 rounded-full z-50 pointer-events-none mix-blend-difference" />
            </div>

            {/* Buttons (Volume/Power) - Cosmetic */}
            <div className={`absolute -left-[10px] top-32 w-[3px] h-12 bg-slate-700 rounded-l ${device === "pixel" ? "top-40" : ""}`} />
            <div className={`absolute -left-[10px] top-48 w-[3px] h-12 bg-slate-700 rounded-l ${device === "pixel" ? "top-56" : ""}`} />
            <div className="absolute -right-[10px] top-40 w-[3px] h-20 bg-slate-700 rounded-r" />

        </motion.div>
    );
}
