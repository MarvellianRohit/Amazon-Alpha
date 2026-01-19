"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ProductCard } from '@/components/search/product-card';
import { Heart, X, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface SwipeableProductCardProps {
    product: any;
    onSwipeRight?: () => void;
    onSwipeLeft?: () => void;
}

export function SwipeableProductCard({ product, onSwipeRight, onSwipeLeft }: SwipeableProductCardProps) {
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);
    const rotate = useTransform(x, [-100, 100], [-10, 10]);
    const [isHovered, setIsHovered] = useState(false);

    // Indicator Opacity
    const likeOpacity = useTransform(x, [10, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-100, -10], [1, 0]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 100) {
            // Swiped Right
            toast.success("Saved to Wishlist!");
            onSwipeRight?.();
        } else if (info.offset.x < -100) {
            // Swiped Left
            onSwipeLeft?.();
        }
    };

    const handlePointerEnter = (e: React.PointerEvent) => {
        // Detect S Pen (pointerType === 'pen') or Mouse
        if (e.pointerType === 'pen' || e.pointerType === 'mouse') {
            setIsHovered(true);
        }
    };

    const handlePointerLeave = () => setIsHovered(false);

    return (
        <motion.div
            style={{ x, opacity, rotate, touchAction: 'none' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: "grabbing" }}
            className="relative cursor-grab"
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >
            {/* Visual Indicators for Swipe */}
            <motion.div style={{ opacity: likeOpacity }} className="absolute top-4 left-4 z-20 bg-green-500 text-white p-2 rounded-full transform -rotate-12 pointer-events-none">
                <Heart className="w-8 h-8 fill-current" />
            </motion.div>
            <motion.div style={{ opacity: nopeOpacity }} className="absolute top-4 right-4 z-20 bg-red-500 text-white p-2 rounded-full transform rotate-12 pointer-events-none">
                <X className="w-8 h-8" />
            </motion.div>

            {/* S Pen Quick View Overlay */}
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-10 bg-black/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none rounded-xl"
                >
                    <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-semibold text-gray-800">
                        <Eye className="w-4 h-4 text-blue-600" />
                        Quick View
                    </div>
                </motion.div>
            )}

            {/* Actual Card */}
            <ProductCard product={product} />
        </motion.div>
    );
}
