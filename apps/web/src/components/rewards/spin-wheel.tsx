"use client";

import { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gift, Sparkles, Trophy } from "lucide-react";

const SEGMENTS = [
    { label: "10% OFF", color: "#6366f1", value: 10 },
    { label: "Free Ship", color: "#8b5cf6", value: 0 },
    { label: "50 Points", color: "#ec4899", value: 50 },
    { label: "Try Again", color: "#64748b", value: null },
    { label: "20% OFF", color: "#f43f5e", value: 20 },
    { label: "Jackpot!", color: "#eab308", value: 1000 },
];

export function SpinWheel() {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const controls = useAnimation();
    const rotationRef = useRef(0);

    const spin = async () => {
        if (spinning) return;

        setSpinning(true);
        setResult(null);

        // Randomize result
        const randomSegmentIndex = Math.floor(Math.random() * SEGMENTS.length);
        const segmentAngle = 360 / SEGMENTS.length;

        // Calculate final rotation (at least 5 full spins + offset to land on segment)
        // Note: The wheel rotates clockwise. The pointer is usually at the top (0 degrees).
        // To land on index i, we need to rotate such that the segment i is at the top.

        const extraSpins = 5 + Math.floor(Math.random() * 3);
        const targetRotation = rotationRef.current + (extraSpins * 360) + (Math.random() * 360);

        // Animate
        await controls.start({
            rotate: targetRotation,
            transition: {
                duration: 4,
                ease: [0.1, 0, 0.2, 1], // Cubic bezier for "spin up then slow down" feel
            },
        });

        rotationRef.current = targetRotation;

        // Determine winner based on angle
        // Normalize angle to 0-360
        const finalAngle = targetRotation % 360;
        // Calculate which segment is at the TOP (270 degrees or -90 degrees in standard circle math, but let's assume standard CSS rotate is 0 at top? No, 0 is usually 12 o'clock for CSS rotate if items are positioned that way? 
        // Actually, let's just pick the random result first and rotate TO it to be safe.

        // Re-do calculation: Pick result, calculate angle.
        // Let's stick to the visual spin for now and just claim the result based on where it landed visually? 
        // It's safer to pre-determine result.
        // Normalized angle where 0 is 12 o'clock.
        // Each segment is 60 degrees.
        // Index 0: 0-60, Index 1: 60-120...
        // If we have a pointer at the top, we read the value at top.
        // If we rotate the WHEEL clockwise, the segments move clockwise.
        // 0 starts at top. After 60deg rotation, Index 5 (last one) is at top.
        // So: Top Index = (TotalSegments - (Rotation / SegmentAngle) % TotalSegments) % TotalSegments

        const index = Math.floor(((360 - (targetRotation % 360)) / segmentAngle)) % SEGMENTS.length;
        const won = SEGMENTS[index];

        setResult(won.label);
        setSpinning(false);

        if (won.value !== null) {
            fireConfetti();
        }
    };

    const fireConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    };

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 text-slate-800 dark:text-white drop-shadow-lg">
                    <div className="w-8 h-8 bg-indigo-500 rotate-45 transform origin-center border-4 border-white dark:border-slate-950 rounded-sm"></div>
                </div>

                {/* Wheel border */}
                <div className="absolute inset-0 rounded-full border-8 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <motion.div
                        className="w-full h-full relative"
                        animate={controls}
                        style={{ borderRadius: "50%" }}
                    >
                        {SEGMENTS.map((seg, i) => {
                            const rotation = (360 / SEGMENTS.length) * i;
                            return (
                                <div
                                    key={i}
                                    className="absolute w-full h-[50%] top-0 left-0 origin-bottom flex justify-center pt-6 text-white font-bold text-sm sm:text-base tracking-wider"
                                    style={{
                                        transform: `rotate(${rotation}deg)`,
                                        backgroundColor: seg.color,
                                        clipPath: "polygon(0 0, 100% 0, 50% 100%)", // Triangle slice
                                        // Note: This clip path is rough simplified for 6 segments. 
                                        // Better to use conics or SVGs for perfect circles, but this works for a quick fun UI.
                                        // Actually, for 6 segments (60deg), a simple conic gradient is easier, but individual divs allow content.
                                        // Let's try a Conic Gradient background for the wheel and overlay text?
                                        // No, let's use the transform trick.
                                        // A CLIP PATH of a pizza slice is tricky with CSS standard.
                                        // Let's switch to a Conic Gradient representation for the background colors and absolute positioning for text.
                                    }}
                                >
                                    <span className="mt-8 transform -rotate-90 md:text-lg drop-shadow-md">
                                        {/* Text is tricky with the rotation. Let's simplify. */}
                                    </span>
                                </div>
                            );
                        })}

                        {/* SVG Overlay for perfect segments */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {SEGMENTS.map((seg, i) => {
                                // 6 segments = 60 degrees each
                                // standard Unit Circle: 0 is 3 o'clock.
                                // We want 0 at 12 o'clock, hence the -rotate-90 on wrapper.
                                const angle = 360 / SEGMENTS.length;
                                const dashArray = `${(100 * Math.PI) / SEGMENTS.length} ${100 * Math.PI}`;
                                // It's easier to use path arcs.
                                // Circle circumference 2*pi*r. r=50. C=314.159
                                // 6 segments. Each is 314/6 = 52.36 length.
                                // Stroke-dasharray approach on a circle element.
                                const r = 25; // radius 25, cx 50, cy 50. Stroke width 50.
                                // C = 2 * pi * 25 = 157.08
                                // Segment len = 157.08 / 6 = 26.18
                                return (
                                    <circle
                                        key={i}
                                        cx="50"
                                        cy="50"
                                        r="25"
                                        fill="transparent"
                                        stroke={seg.color}
                                        strokeWidth="50"
                                        strokeDasharray={`${157.08 / SEGMENTS.length} 157.08`}
                                        strokeDashoffset={- (157.08 / SEGMENTS.length) * i} // Offset logic
                                    // If offset is negative, it moves clockwise?
                                    />
                                )
                            })}
                        </svg>

                        {/* Text Labels Overlay */}
                        {SEGMENTS.map((seg, i) => {
                            const angle = (360 / SEGMENTS.length) * i + (360 / SEGMENTS.length) / 2; // Middle of segment
                            return (
                                <div
                                    key={i}
                                    className="absolute top-1/2 left-1/2 w-full h-[1px]"
                                    style={{
                                        transform: `translate(-50%, -50%) rotate(${angle - 90}deg)`, // -90 because 0 is right
                                        pointerEvents: 'none'
                                    }}
                                >
                                    <div className="absolute right-[10%] top-1/2 -translate-y-1/2 text-white font-bold text-shadow-sm text-center w-24 transform rotate-90"
                                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                                    >
                                        {seg.label}
                                    </div>
                                </div>
                            )
                        })}
                    </motion.div>

                    {/* Center hub */}
                    <div className="absolute top-1/2 left-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-full shadow-lg z-10 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-indigo-500" />
                    </div>
                </div>
            </div>

            <div className="text-center space-y-4">
                {result ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-2"
                    >
                        <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {result === "Try Again" ? "Oops! So close!" : `You Won: ${result}`}
                        </h3>
                        <p className="text-muted-foreground">
                            {result === "Try Again" ? "Better luck next time!" : "Check your email for the code."}
                        </p>
                    </motion.div>
                ) : (
                    <div className="h-16 flex items-center justify-center">
                        <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
                            {spinning ? "Spinning..." : "Feeling Lucky today?"}
                        </p>
                    </div>
                )}

                <Button
                    size="lg"
                    onClick={spin}
                    disabled={spinning}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-6 rounded-full text-lg shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
                >
                    {spinning ? "Good Luck!" : "SPIN NOW"}
                </Button>
            </div>
        </div>
    );
}
