"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

interface VoiceOverlayProps {
    isOpen: boolean;
    transcript: string;
    onClose: () => void;
}

export function VoiceOverlay({ isOpen, transcript, onClose }: VoiceOverlayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!isOpen || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const draw = () => {
            time += 0.05;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'cyan';
            ctx.beginPath();

            const width = canvas.width;
            const height = canvas.height;
            const amplitude = 50;
            const frequency = 0.02;

            for (let x = 0; x < width; x++) {
                // Simulate waveform based on "activity" (just time for now + random jitter if transcript exists)
                const jitter = transcript ? Math.random() * 5 : 0;
                const y = height / 2 + Math.sin(x * frequency + time) * (amplitude + jitter);
                ctx.lineTo(x, y);
            }

            ctx.stroke();

            // Second Wave (Magenta)
            ctx.beginPath();
            ctx.strokeStyle = 'magenta';
            for (let x = 0; x < width; x++) {
                const y = height / 2 + Math.sin(x * frequency + time + 2) * (amplitude * 0.8);
                ctx.lineTo(x, y);
            }
            ctx.stroke();

            animationId = requestAnimationFrame(draw);
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [isOpen, transcript]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center backdrop-blur-xl"
                    onClick={onClose}
                >
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-50" />

                    <div className="z-10 text-center space-y-8 relative">
                        <div className="w-24 h-24 rounded-full border-4 border-cyan-500 shadow-[0_0_30px_cyan] flex items-center justify-center animate-pulse mx-auto">
                            <div className="w-16 h-16 rounded-full bg-cyan-400/20" />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                            {transcript || "Listening..."}
                        </h2>

                        <p className="text-gray-400 text-sm">
                            Try "Go to Cart", "View Orders", or "Search for..."
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
