"use client";

import { motion } from "framer-motion";

export function AlphaShape({ className }: { className?: string }) {
    // High-Fidelity, Articulated Version
    // The "Alpha" is a geometric, predatory cat (Panther/Cheetah mix).
    // Articulation points: Head, Front Leg, Back Leg, Body Bob.

    const runCycleDuration = 0.4; // Speed of the gallop

    return (
        <svg
            viewBox="0 0 200 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Dynamic Drop Shadow */}
            <motion.ellipse
                cx="100" cy="110" rx="40" ry="5"
                fill="black"
                className="opacity-20 blur-sm"
                animate={{
                    rx: [40, 50, 40],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                    duration: runCycleDuration,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Whole Body Group - Bobs up and down */}
            <motion.g
                animate={{ y: [0, -5, 0] }}
                transition={{
                    duration: runCycleDuration,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {/* Back Leg (Far Side) */}
                <motion.path
                    d="M50 70 L 30 90 L 20 85 L 60 65 Z"
                    className="fill-indigo-900 dark:fill-indigo-800"
                    style={{ originX: 0.5, originY: 0 }} // Rotate from hip
                    animate={{ rotate: [20, -30, 20] }}
                    transition={{ duration: runCycleDuration, repeat: Infinity, ease: "linear" }}
                />

                {/* Front Leg (Far Side) */}
                <motion.path
                    d="M150 70 L 170 90 L 180 85 L 140 65 Z"
                    className="fill-indigo-900 dark:fill-indigo-800"
                    style={{ originX: 0.5, originY: 0 }} // Rotate from shoulder
                    animate={{ rotate: [-20, 30, -20] }}
                    transition={{ duration: runCycleDuration, repeat: Infinity, ease: "linear" }}
                />

                {/* Main Body */}
                <path
                    d="M40 60 C 40 60, 60 40, 100 40 C 140 40, 160 50, 180 45 L 190 48 L 180 55 C 160 65, 140 70, 100 70 C 60 70, 50 65, 40 60 Z"
                    className="fill-indigo-600 dark:fill-indigo-400"
                />

                {/* Head - slight stabilization/independent bob */}
                <motion.path
                    d="M180 45 L 195 40 L 200 45 L 190 52 Z"
                    className="fill-indigo-500 dark:fill-indigo-300"
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: runCycleDuration, repeat: Infinity }}
                />

                {/* Back Leg (Near Side) - Offset phase */}
                <motion.path
                    d="M50 70 L 25 100 L 40 105 L 60 70 Z"
                    className="fill-indigo-800 dark:fill-indigo-500"
                    style={{ originX: 0.5, originY: 0 }}
                    animate={{ rotate: [-30, 30, -30] }}
                    transition={{ duration: runCycleDuration, repeat: Infinity, ease: "linear" }}
                />

                {/* Front Leg (Near Side) - Offset phase */}
                <motion.path
                    d="M150 70 L 170 100 L 160 105 L 140 70 Z"
                    className="fill-indigo-800 dark:fill-indigo-500"
                    style={{ originX: 0.5, originY: 0 }}
                    animate={{ rotate: [45, -45, 45] }}
                    transition={{ duration: runCycleDuration, repeat: Infinity, ease: "linear" }}
                />

                {/* Neon Accents / Tech Lines */}
                <motion.path
                    d="M60 55 L 140 55"
                    stroke="cyan"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="opacity-80"
                    animate={{ pathLength: [0.2, 0.8, 0.2], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </motion.g>
        </svg>
    );
}
