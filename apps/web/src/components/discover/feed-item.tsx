"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, ShoppingBag, MoreHorizontal, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

export interface FeedItemData {
    id: string;
    type: "video" | "image";
    src: string;
    poster?: string;
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
    };
    creator: {
        id: string;
        name: string;
        handle: string;
        avatar: string;
    };
    likes: number;
    comments: number;
    description: string;
    tags: string[];
}

interface FeedItemProps {
    item: FeedItemData;
    isActive: boolean;
}

export function FeedItem({ item, isActive }: FeedItemProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(true);
    const [liked, setLiked] = useState(false);

    // Auto-play/pause based on active state
    useEffect(() => {
        if (item.type === "video" && videoRef.current) {
            if (isActive) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
            } else {
                videoRef.current.pause();
                setPlaying(false);
            }
        }
    }, [isActive, item.type]);

    const togglePlay = () => {
        if (item.type !== "video" || !videoRef.current) return;
        if (playing) {
            videoRef.current.pause();
            setPlaying(false);
        } else {
            videoRef.current.play();
            setPlaying(true);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !muted;
            setMuted(!muted);
        }
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLiked(!liked);
    };

    return (
        <div className="relative h-full w-full bg-black overflow-hidden select-none">
            {/* Media Content */}
            <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
                {item.type === "video" ? (
                    <>
                        <video
                            ref={videoRef}
                            src={item.src}
                            poster={item.poster}
                            className="h-full w-full object-cover"
                            loop
                            playsInline
                            muted={muted}
                        />
                        {/* Play/Pause Overlay Indicator */}
                        {!playing && isActive && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Play className="w-16 h-16 text-white/80 fill-white" />
                            </div>
                        )}
                    </>
                ) : (
                    <Image
                        src={item.src}
                        alt={item.description}
                        fill
                        className="object-cover"
                        priority={isActive}
                    />
                )}
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/60" />

            {/* Right Sidebar Actions */}
            <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center z-10 text-white">
                <div className="flex flex-col items-center gap-1">
                    <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600">
                        <Avatar className="w-10 h-10 border-2 border-black">
                            <AvatarImage src={item.creator.avatar} />
                            <AvatarFallback>{item.creator.name[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={handleLike}>
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full group-hover:bg-white/20 transition-all">
                        <Heart className={`w-6 h-6 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-white"}`} />
                    </div>
                    <span className="text-xs font-semibold drop-shadow-md">{liked ? item.likes + 1 : item.likes}</span>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full group-hover:bg-white/20 transition-all">
                        <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold drop-shadow-md">{item.comments}</span>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full group-hover:bg-white/20 transition-all">
                        <Share2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold drop-shadow-md">Share</span>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full group-hover:bg-white/20 transition-all">
                        <MoreHorizontal className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            {/* Bottom Info Section */}
            <div className="absolute bottom-0 left-0 w-full p-4 pb-8 z-10 bg-gradient-to-t from-black/80 to-transparent pt-20">
                <div className="flex justify-between items-end gap-4">
                    <div className="flex-1 space-y-3">
                        {/* Creator Info */}
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-lg drop-shadow-md">@{item.creator.handle}</span>
                            <Badge variant="outline" className="text-white border-white/40 bg-white/10 backdrop-blur-sm">Following</Badge>
                        </div>

                        {/* Description */}
                        <p className="text-white/90 text-sm leading-snug line-clamp-2 max-w-[85%]">
                            {item.description}
                            <span className="font-bold ml-2 text-white">#fyp #trending</span>
                        </p>

                        {/* Product Tag */}
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-lg max-w-[80%] hover:bg-white/20 transition-colors cursor-pointer border border-white/10 mt-2">
                            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-white shrink-0">
                                <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-white/70 line-clamp-1">Shop this look</p>
                                <p className="text-sm font-semibold text-white truncate">{item.product.name}</p>
                            </div>
                            <div className="px-3 py-1 bg-indigo-600 rounded-full text-xs font-bold text-white shrink-0">
                                ${item.product.price}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mute Button */}
            {item.type === "video" && (
                <button
                    onClick={toggleMute}
                    className="absolute top-24 right-4 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-all z-20"
                >
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
            )}
        </div>
    );
}

