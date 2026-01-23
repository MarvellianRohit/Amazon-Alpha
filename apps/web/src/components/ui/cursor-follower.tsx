"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function CursorFollower() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 10);
            cursorY.set(e.clientY - 10);
        };

        window.addEventListener("mousemove", moveCursor);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-5 h-5 bg-indigo-500 rounded-full pointer-events-none z-[9999] opacity-30 blur-sm mix-blend-screen hidden lg:block"
            style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
            }}
        >
            <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20" />
        </motion.div>
    );
}
