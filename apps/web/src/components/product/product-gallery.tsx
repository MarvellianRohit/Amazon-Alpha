"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Box, Image as ImageIcon } from "lucide-react";
import { Product3DViewer } from "./product-3d-viewer";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    isDigitalTwin?: boolean;
    name: string;
}

export function ProductGallery({ images, isDigitalTwin, name }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(images[0]);
    const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");

    return (
        <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-xl border bg-white dark:bg-slate-900 group">

                {viewMode === "3d" ? (
                    <Product3DViewer />
                ) : (
                    <Image
                        src={activeImage}
                        alt={name}
                        fill
                        className="object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                        priority
                    />
                )}

                {/* Badges / Controls Overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {isDigitalTwin && (
                        <div className="bg-purple-600/90 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Digital Twin
                        </div>
                    )}
                </div>

                <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button
                        size="sm"
                        variant={viewMode === "2d" ? "default" : "secondary"}
                        className={cn("rounded-full", viewMode === "2d" && "bg-white text-black hover:bg-slate-200")}
                        onClick={() => setViewMode("2d")}
                    >
                        <ImageIcon className="w-4 h-4 mr-2" /> 2D
                    </Button>
                    <Button
                        size="sm"
                        variant={viewMode === "3d" ? "default" : "secondary"}
                        className={cn("rounded-full", viewMode === "3d" && "bg-indigo-600 hover:bg-indigo-700 text-white")}
                        onClick={() => setViewMode("3d")}
                    >
                        <Box className="w-4 h-4 mr-2" /> 3D
                    </Button>
                </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setActiveImage(img);
                            setViewMode("2d"); // Switch back to 2D on thumb click
                        }}
                        className={cn(
                            "aspect-square relative rounded-lg border bg-white dark:bg-slate-900 cursor-pointer overflow-hidden transition-all",
                            activeImage === img && viewMode === "2d" ? "ring-2 ring-primary ring-offset-2" : "hover:opacity-80"
                        )}
                    >
                        <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}
