"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AlphaShape } from "./alpha-shape";

// Particle Component for the trail
const TrailParticle = ({ delay, i }: { delay: number; i: number }) => (
    <motion.div
        initial={{ opacity: 0, x: 0, scale: 0.5 }}
        animate={{
            opacity: [0, 1, 0],
            x: -100, // Move left relative to runner (creating trail)
            // Deterministic: No jitter to ensure perfect hydration
            y: 0,
            scale: 0
        }}
        transition={{
            duration: 0.8,
            delay: delay,
            repeat: Infinity,
            repeatDelay: 0.5
        }}
        className="absolute bottom-4 left-10 w-2 h-2 rounded-full bg-cyan-400 blur-[2px]"
    />
);

export function MascotRunner() {
    const [hasRun, setHasRun] = useState(false);

    useEffect(() => {
        const hasSeenIntro = sessionStorage.getItem("alpha_intro_v2_seen");
        if (!hasSeenIntro) {
            sessionStorage.setItem("alpha_intro_v2_seen", "true");
        } else {
            // setHasRun(true); 
        }
    }, []);

    if (hasRun) return null;

    // Generate some random particles (Deterministic)
    const particles = Array.from({ length: 8 }).map((_, i) => (
        <TrailParticle key={i} delay={i * 0.1} i={i} />
    ));

    return (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            <motion.div
                initial={{ x: "-30vw" }}
                animate={{ x: "130vw" }}
                transition={{
                    duration: 2.8,
                    ease: [0.4, 0, 0.2, 1], // Slow start, fast middle, smooth end
                }}
                className="absolute top-1/2 -translate-y-1/2 w-64 h-32 md:w-96 md:h-48"
            >
                {/* The Running Alpha */}
                <AlphaShape className="w-full h-full drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]" />

                {/* Particle System Container */}
                <div className="absolute inset-0 z-[-1]">
                    {particles}
                </div>

                {/* Speed Lines */}
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <motion.div
                        className="absolute top-1/2 right-full w-48 h-[2px] bg-white blur-sm"
                        animate={{ x: [0, 200], opacity: [0, 0.8, 0] }}
                        transition={{ duration: 0.3, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>

            {/* Cinematic Flash Overlay */}
            <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.1, 0] }}
                transition={{ duration: 0.2, delay: 1.5 }}
            />
        </div>
    );
}
