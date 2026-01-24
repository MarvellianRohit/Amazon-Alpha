"use client";

import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Camera, ScanLine, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function VisualSearchCamera({ onClose }: { onClose: () => void }) {
    const webcamRef = useRef<Webcam>(null);
    const [scanned, setScanned] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const capture = useCallback(async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setScanned(true);
            toast.info("Processing on Edge NPU...");

            // Simulate API Call
            // const res = await fetch('/api/v1/visual-search/query', ...)

            setTimeout(() => {
                setResults([
                    { name: "Modern Leather Sofa", price: 899, score: 98 },
                    { name: "Armchair", price: 450, score: 92 },
                ]);
                toast.success("Found 2 Matches", { description: "Triton Inference: 12ms" });
            }, 1000);
        }
    }, [webcamRef]);

    return (
        <div className="fixed inset-0 z-[60] bg-black text-white flex flex-col">
            {/* Header */}
            <div className="p-4 flex justify-between items-center bg-black/50 backdrop-blur-md z-10 absolute top-0 w-full">
                <div className="flex items-center gap-2">
                    <ScanLine className="w-6 h-6 text-green-400" />
                    <div>
                        <h2 className="font-bold text-sm">Visual Search Engine</h2>
                        <div className="text-[10px] text-neutral-400 flex gap-2">
                            <span className="flex items-center gap-0.5"><Zap className="w-3 h-3 text-yellow-400" /> INT8 Quantized</span>
                            <span>•</span>
                            <span>Triton Server</span>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-6 h-6" />
                </Button>
            </div>

            {/* Camera View */}
            <div className="flex-1 relative">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                />

                {/* Scanner Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 border-2 border-green-400/50 rounded-lg relative">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
                        <motion.div
                            animate={{ y: [0, 250, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="w-full h-0.5 bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
                        />
                    </div>
                </div>
            </div>

            {/* Results / Controls */}
            <div className="bg-black/80 p-6 pb-12 rounded-t-3xl backdrop-blur-xl">
                <AnimatePresence>
                    {!results.length ? (
                        <div className="flex justify-center">
                            <Button
                                onClick={capture}
                                size="lg"
                                className="rounded-full w-20 h-20 bg-white hover:bg-neutral-200 border-4 border-neutral-300"
                            >
                                <Camera className="w-8 h-8 text-black" />
                            </Button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="text-xs text-neutral-400 font-mono mb-2">
                                Query Time: 27ms | FLOPs Saved: 3.8G
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {results.map((res, i) => (
                                    <div key={i} className="min-w-[160px] bg-neutral-900 rounded-xl p-3 border border-neutral-800">
                                        <div className="h-24 bg-neutral-800 rounded-lg mb-2"></div>
                                        <div className="font-bold text-sm truncate">{res.name}</div>
                                        <div className="text-xs text-green-400 font-mono">${res.price}</div>
                                        <div className="text-[10px] text-neutral-500 mt-1">
                                            Match: {res.score}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full" variant="outline" onClick={() => setResults([])}>
                                Scan Again
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
