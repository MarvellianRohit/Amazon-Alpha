"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, PenTool } from "lucide-react";

interface SignaturePadProps {
    onSign: (signature: string | null) => void;
}

export function SignaturePad({ onSign }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set line style
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Handle resizing if needed, for now fixed size in container
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            onSign(canvas.toDataURL());
            setHasSignature(true);
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.beginPath(); // Reset path
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
        onSign(null);
    };

    return (
        <div className="space-y-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 touch-none overflow-hidden relative">
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={200}
                    className="w-full h-[200px] cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                />
                {!hasSignature && !isDrawing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400">
                        <PenTool className="w-4 h-4 mr-2" />
                        Sign here using S Pen or Finger
                    </div>
                )}
            </div>
            <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={clear} className="text-gray-500 hover:text-red-600">
                    <Eraser className="w-4 h-4 mr-2" />
                    Clear Signature
                </Button>
            </div>
        </div>
    );
}
