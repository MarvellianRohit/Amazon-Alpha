"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomPosition({ x, y });
    };

    return (
        <div className="flex flex-col gap-4 sticky top-24 h-fit">
            {/* Main Image Stage */}
            <div
                ref={containerRef}
                className="relative w-full aspect-square bg-white rounded-xl border overflow-hidden cursor-crosshair group"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
            >
                <Image
                    src={selectedImage}
                    alt={title}
                    fill
                    className="object-contain p-4"
                    priority
                />

                {/* Lens / Zoom Window Overlay */}
                {showZoom && (
                    <div
                        className="absolute inset-0 pointer-events-none hidden lg:block"
                        style={{
                            backgroundImage: `url(${selectedImage})`,
                            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                            backgroundSize: '250%', // 2.5x Zoom
                            zIndex: 50
                        }}
                    />
                )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={cn(
                            "relative w-20 h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all",
                            selectedImage === img ? "border-blue-600 ring-2 ring-blue-100" : "border-gray-200 hover:border-gray-300"
                        )}
                    >
                        <Image
                            src={img}
                            alt={`${title} thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
