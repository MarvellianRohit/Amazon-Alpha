"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Shirt, X, Maximize, ScanFace } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function VirtualTryOn({ onClose }: { onClose: () => void }) {
    const [cameraActive, setCameraActive] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [meshApplied, setMeshApplied] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (cameraActive && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    if (videoRef.current) videoRef.current.srcObject = stream;
                })
                .catch(err => console.error("Camera denied:", err));
        }
        return () => {
            // Cleanup stream
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(t => t.stop());
            }
        }
    }, [cameraActive]);

    const handleApplyMesh = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setMeshApplied(true);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="w-full max-w-4xl bg-black border border-white/20 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row h-[80vh]">

                {/* Close Button */}
                <Button onClick={onClose} variant="ghost" className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full">
                    <X className="w-6 h-6" />
                </Button>

                {/* Main Viewport (Camera/Model) */}
                <div className="flex-1 relative bg-neutral-900 flex items-center justify-center overflow-hidden">
                    {!cameraActive ? (
                        <div className="text-center p-8">
                            <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-indigo-500/20">
                                <Camera className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Virtual Mirror</h2>
                            <p className="text-neutral-400 mb-8 max-w-md mx-auto">
                                Grant camera access to see this item on you using our Physics-Based Rendering engine.
                            </p>
                            <Button onClick={() => setCameraActive(true)} size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-lg px-8 py-6 rounded-xl hover:scale-105 transition-transform">
                                Activate Camera
                            </Button>
                        </div>
                    ) : (
                        <div className="relative w-full h-full">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />

                            {/* AR Overlay UI */}
                            <div className="absolute inset-0 pointer-events-none border-[20px] border-white/5 rounded-3xl" />
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-4 py-1 rounded-full text-xs font-mono text-green-400 border border-green-500/30 flex items-center gap-2">
                                <ScanFace className="w-3 h-3 animate-pulse" />
                                BODY MESH TRACKING: ACTIVE
                            </div>

                            {/* The "Virtual Cloth" Mesh Simulation */}
                            <AnimatePresence>
                                {meshApplied && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    >
                                        {/* This is a visual representation of the 'mesh' overlay. In prod, this is a 3D canvas */}
                                        <img src="/placeholder-shirt-overlay.png" className="w-1/2 opacity-80 mix-blend-overlay" alt="" />
                                        {/* Fallback visual if image missing */}
                                        <div className="w-[300px] h-[400px] border-2 border-dashed border-indigo-500/50 rounded-3xl flex items-center justify-center bg-indigo-500/10">
                                            <span className="text-indigo-300 font-bold text-xl tracking-widest uppercase">AR MODEL PROJECTED</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Processing State */}
                            {processing && (
                                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
                                    <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                                    <div className="text-white font-mono text-lg">CALIBRATING FABRIC PHYSICS...</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Controls Sidebar */}
                <div className="w-full md:w-80 bg-neutral-900/90 backdrop-blur-xl border-l border-white/10 p-6 flex flex-col gap-6">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-1">Customization</h3>
                        <p className="text-neutral-500 text-sm">Adjust fit and lighting.</p>
                    </div>

                    <div className="space-y-3 flex-1">
                        <div className="bg-black/40 p-3 rounded-xl border border-white/5 hover:border-indigo-500/50 cursor-pointer transition-colors" onClick={handleApplyMesh}>
                            <h4 className="text-white font-medium text-sm flex items-center gap-2">
                                <Shirt className="w-4 h-4 text-indigo-400" /> Standard Fit
                            </h4>
                        </div>
                        <div className="bg-black/40 p-3 rounded-xl border border-white/5 hover:border-indigo-500/50 cursor-pointer transition-colors">
                            <h4 className="text-white font-medium text-sm flex items-center gap-2">
                                <Maximize className="w-4 h-4 text-pink-400" /> Oversized
                            </h4>
                        </div>
                    </div>

                    <Button
                        onClick={handleApplyMesh}
                        disabled={!cameraActive || processing}
                        className="w-full bg-white text-black hover:bg-neutral-200 py-6 text-lg font-bold"
                    >
                        {meshApplied ? "Change Style" : "Try On Now"}
                    </Button>
                </div>

            </div>
        </div>
    );
}
