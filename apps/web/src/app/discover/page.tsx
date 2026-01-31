"use client";

import { useRef, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { FeedItem, type FeedItemData } from "@/components/discover/feed-item";
import { motion } from "framer-motion";

// Mock Data
const FEED_ITEMS: FeedItemData[] = [
    {
        id: "1",
        type: "image",
        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
        product: {
            id: "p1",
            name: "Summer Floral Dress",
            price: 79.99,
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80"
        },
        creator: {
            id: "u1",
            name: "Sarah Style",
            handle: "sarahstyle",
            avatar: "https://i.pravatar.cc/150?u=sarah"
        },
        likes: 1204,
        comments: 89,
        description: "Loving this new summer collection! 🌸 The fabric is so breathable and light. Perfect for beach days.",
        tags: ["summer", "fashion", "ootd"]
    },
    {
        id: "2",
        type: "image", // Using image for mock, would be video in real app
        src: "https://images.unsplash.com/photo-1550614000-4b9519e09cd3?w=800&q=80",
        product: {
            id: "p2",
            name: "Premium Wireless Headphones",
            price: 249.99,
            image: "https://images.unsplash.com/photo-1550614000-4b9519e09cd3?w=200&q=80"
        },
        creator: {
            id: "u2",
            name: "Tech Guru",
            handle: "techguru",
            avatar: "https://i.pravatar.cc/150?u=tech"
        },
        likes: 5602,
        comments: 412,
        description: "The noise cancellation on these is insane 🎧 Can't hear anything but the music.",
        tags: ["tech", "music", "gadgets"]
    },
    {
        id: "3",
        type: "image",
        src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        product: {
            id: "p3",
            name: "Nike Air Max Red",
            price: 129.99,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80"
        },
        creator: {
            id: "u3",
            name: "Sneaker Head",
            handle: "sneakerhead",
            avatar: "https://i.pravatar.cc/150?u=sneaker"
        },
        likes: 8900,
        comments: 102,
        description: "Just copped the new reds! 🔥 These are fire on foot. What do you think?",
        tags: ["sneakers", "nike", "streetwear"]
    }
];

export default function DiscoverPage() {
    // axis: 'y' for vertical scrolling
    // loop: false to stop at end
    const [emblaRef, emblaApi] = useEmblaCarousel({ axis: 'y', loop: false });
    const [activeIndex, setActiveIndex] = useState(0);

    // Track active slide
    if (emblaApi) {
        emblaApi.on("select", () => {
            setActiveIndex(emblaApi.selectedScrollSnap());
        });
    }

    return (
        <div className="fixed inset-0 bg-black text-white z-50 flex flex-col">
            {/* Top Bar Overlay */}
            <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <Navbar className="bg-transparent border-none text-white" simple />
            </div>

            {/* Carousel */}
            <div className="flex-1 h-full w-full overflow-hidden" ref={emblaRef}>
                <div className="flex flex-col h-full touch-pan-y">
                    {FEED_ITEMS.map((item, index) => (
                        <div
                            key={item.id}
                            className="flex-[0_0_100%] h-full min-h-full relative"
                        >
                            <FeedItem item={item} isActive={index === activeIndex} />
                        </div>
                    ))}

                    {/* End of Feed */}
                    <div className="flex-[0_0_100%] h-full min-h-full flex items-center justify-center bg-zinc-950">
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-bold">You're all caught up!</h2>
                            <p className="text-muted-foreground">Check back later for more.</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => emblaApi?.scrollTo(0)}
                                className="px-6 py-3 bg-white text-black rounded-full font-bold"
                            >
                                Start Over
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
