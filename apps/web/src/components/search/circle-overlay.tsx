"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Scan, Sparkles, Search, Copy, ShoppingCart, X } from "lucide-react";

interface CircleOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

interface DetectionResult {
    title: string;
    price?: string;
}

export function CircleOverlay({ isOpen, onClose }: CircleOverlayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [endPos, setEndPos] = useState({ x: 0, y: 0 }); // Track end pos for menu placement
    const [result, setResult] = useState<DetectionResult | null>(null);
    const router = useRouter();

    // Resize handler
    const resize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('resize', resize);
            resize();
            // Lock body scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Unlock body scroll
            document.body.style.overflow = '';
            setResult(null); // Reset result on close
        }
        return () => {
            window.removeEventListener('resize', resize);
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const draw = (curX: number, curY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dim background
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Cut out selection
        const width = curX - startPos.x;
        const height = curY - startPos.y;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.beginPath();
        ctx.roundRect(startPos.x, startPos.y, width, height, 12);
        ctx.fill();

        // Border & Glow
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(startPos.x, startPos.y, width, height, 12);
        ctx.stroke();

        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        ctx.stroke();
        ctx.shadowBlur = 0;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setResult(null); // Clear previous result
        setIsDrawing(true);
        setStartPos({ x: e.clientX, y: e.clientY });
        setEndPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        setEndPos({ x: e.clientX, y: e.clientY });
        draw(e.clientX, e.clientY);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        setIsDrawing(false);

        // 1. Calculate Center of Selection
        const centerX = startPos.x + (e.clientX - startPos.x) / 2;
        const centerY = startPos.y + (e.clientY - startPos.y) / 2;

        // 2. Hide Canvas temporarily to find element underneath
        if (canvasRef.current) canvasRef.current.style.visibility = 'hidden';

        // 3. Detect Element
        const element = document.elementFromPoint(centerX, centerY);

        // Restore Canvas
        if (canvasRef.current) canvasRef.current.style.visibility = 'visible';

        // 4. Traverse up to find data attributes
        const productCard = element?.closest('[data-scan-title]');

        let detectedTitle = "";
        let detectedPrice = "";

        if (productCard) {
            detectedTitle = productCard.getAttribute('data-scan-title') || "";
            detectedPrice = productCard.getAttribute('data-scan-price') || "";
        } else {
            // Fallback: Try to get text content if no card found
            detectedTitle = (element?.textContent || "").substring(0, 30).trim();
            if (!detectedTitle) detectedTitle = "Unknown Object";
        }

        if (detectedTitle && detectedTitle.length > 2) {
            setResult({ title: detectedTitle, price: detectedPrice });
        } else {
            // Nothing meaningful found
            setResult({ title: "Nothing detected", price: "" });
        }
    };

    const copyToClipboard = () => {
        if (result?.title) {
            navigator.clipboard.writeText(result.title);
            onClose();
        }
    };

    const searchGoogle = () => {
        if (result?.title) {
            router.push(`/search?q=${encodeURIComponent(result.title)}`);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] cursor-crosshair"
                >
                    {!isDrawing && !result && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white/90 text-slate-900 px-6 py-3 rounded-full shadow-xl font-medium flex items-center gap-2 backdrop-blur-md"
                            >
                                <Scan className="w-5 h-5" />
                                Draw anywhere to search
                            </motion.div>
                        </div>
                    )}

                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full touch-none"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-all z-50"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Result Popover Menu */}
                    {result && (
                        <div
                            className="absolute z-50 pointer-events-auto"
                            style={{
                                left: Math.min(Math.max(endPos.x, 20), window.innerWidth - 320), // Keep bounded
                                top: Math.min(Math.max(endPos.y + 20, 20), window.innerHeight - 200)
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-white/20 overflow-hidden w-80"
                            >
                                {/* Header */}
                                <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-white">
                                        <Sparkles className="w-4 h-4 fill-white" />
                                        <span className="font-bold text-sm">Detected</span>
                                    </div>
                                    <span className="text-xs text-indigo-200 bg-indigo-700 px-2 py-0.5 rounded-full">
                                        Instant
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg leading-tight mb-1 break-words">
                                        {result.title}
                                    </h3>
                                    {result.price && (
                                        <p className="text-sm text-gray-500 mb-4">
                                            Estimated Value: ${result.price}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        <button
                                            onClick={searchGoogle}
                                            className="col-span-2 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 py-2.5 rounded-lg font-medium transition-colors text-sm"
                                        >
                                            <Search className="w-4 h-4" />
                                            Google Search
                                        </button>
                                        <button
                                            onClick={copyToClipboard}
                                            className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 py-2.5 rounded-lg font-medium transition-colors text-sm"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </button>
                                        <button
                                            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-colors text-sm"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Shop
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
