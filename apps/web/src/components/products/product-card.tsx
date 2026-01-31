"use client";

import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Eye } from "lucide-react"
import { useState } from "react"
import { ProductQuickLook } from "@/components/products/product-quick-look"

function WishlistHeart() {
    const [liked, setLiked] = useState(false);
    const [exploding, setExploding] = useState(false);

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!liked) {
            setExploding(true);
            setTimeout(() => setExploding(false), 500);
        }
        setLiked(!liked);
    }

    return (
        <button
            onClick={handleLike}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm transition-all relative z-30"
        >
            <motion.div
                animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Heart
                    className={`w-5 h-5 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-500"}`}
                />
            </motion.div>

            <AnimatePresence>
                {exploding && (
                    <>
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                animate={{
                                    opacity: 0,
                                    scale: 1,
                                    x: Math.cos(i * 60 * (Math.PI / 180)) * 20,
                                    y: Math.sin(i * 60 * (Math.PI / 180)) * 20
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full"
                                style={{ marginLeft: '-4px', marginTop: '-4px' }}
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>
        </button>
    )
}

type ProductCardProps = {
    id: string
    title: string
    price: number
    image?: string
    category: string
}

export default function ProductCard({ id, title, price, image, category }: ProductCardProps) {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg tilt
        const rotateY = ((x - centerX) / centerX) * 5;

        setRotation({ x: rotateX, y: rotateY });

        // Glare moves opposite
        setGlare({
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100,
            opacity: 1
        });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
        setGlare(prev => ({ ...prev, opacity: 0 }));
    };

    // Construct a mock product object for QuickLook
    // In a real app, ProductCard would likely receive the full object
    const quickLookProduct: any = {
        id,
        name: title,
        price: price,
        imageUrl: image,
        description: `Experience the premium quality of ${title}. Perfect for your daily needs in the ${category} category.`, // Generated description
        stock: 12, // Mock stock
        category: category
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.3 }}
            className="h-full perspective-1000"
        >
            <motion.div
                animate={{ rotateX: rotation.x, rotateY: rotation.y }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="h-full"
            >
                <Card
                    data-scan-title={title}
                    data-scan-price={price}
                    className="h-full flex flex-col transition-all hover:shadow-2xl border-transparent hover:border-indigo-100 dark:hover:border-indigo-900 overflow-hidden relative group"
                >

                    {/* Holographic Glare Overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 mix-blend-overlay opacity-0 group-hover:opacity-100"
                        style={{
                            background: `radial-gradient(
                                circle at ${glare.x}% ${glare.y}%, 
                                rgba(255,255,255,0.8) 0%, 
                                rgba(255,255,255,0) 80%
                            )`,
                            opacity: glare.opacity
                        }}
                    />

                    {/* Holofoil Sheen */}
                    <div
                        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-30 bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.4)_25%,transparent_30%,rgba(255,0,255,0.3)_45%,rgba(0,255,255,0.3)_50%,transparent_55%)] bg-[length:250%_250%]"
                        style={{
                            backgroundPosition: `${glare.x}% ${glare.y}%`
                        }}
                    />

                    <CardHeader className="p-0">
                        <div className="aspect-square bg-gray-100 dark:bg-slate-800 relative rounded-t-lg overflow-hidden flex items-center justify-center group/image">

                            {/* Quick Look Wrapper around Image */}
                            <ProductQuickLook product={quickLookProduct}>
                                <div className="w-full h-full flex items-center justify-center cursor-help">
                                    {/* Placeholder for real image */}
                                    <motion.span
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                        className="text-gray-400 dark:text-gray-600 group-hover/image:text-indigo-500 transition-colors"
                                    >
                                        Product Image
                                    </motion.span>

                                    {/* Mobile/Tablet Hint */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/50 text-white text-[10px] rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity pointer-events-none">
                                        Quick Look
                                    </div>
                                </div>
                            </ProductQuickLook>

                            {/* Heart Explosion Button */}
                            <div className="absolute top-2 right-2 z-30">
                                <WishlistHeart />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{category}</p>
                        <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">{title}</h3>
                        <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            <Price amount={price} />
                        </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                        <Button asChild className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-100 transition-all z-30 relative">
                            <Link href={`/products/${id}`}>View Details</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </motion.div>
    )
}
