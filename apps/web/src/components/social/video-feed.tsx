// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player'; // Assuming installed or will be mocked if missing
import { useInView } from 'react-intersection-observer';
import { Heart, MessageCircle, Share2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { OneTapCheckout } from './one-tap-checkout';

interface SocialPost {
    id: string;
    creator_name: string;
    creator_avatar: string;
    video_url: string;
    caption: string;
    product_id: string;
    product_title: string;
    product_price: number;
    trust_score: number;
    likes: number;
}

function VideoPost({ post }: { post: SocialPost }) {
    const { ref, inView } = useInView({
        threshold: 0.6,
    });

    return (
        <div ref={ref} className="snap-start h-full w-full relative bg-black flex items-center justify-center">
            {/* Video Player */}
            <div className="absolute inset-0 z-0">
                {/* Note: ReactPlayer might trip hydration errors if not handled carefully, usually okay in client comp */}
                {/* @ts-ignore */}
                <ReactPlayer
                    url={post.video_url}
                    playing={inView}
                    loop
                    muted={false} // In real mobile app, start muted or handle user interaction
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover' }}
                />
            </div>

            {/* Overlay UI */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent">

                {/* Right Actions */}
                <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-1">
                        <div className="p-3 bg-white/10 backdrop-blur rounded-full">
                            <Heart className="w-8 h-8 text-white fill-white/20 hover:fill-red-500 transition-colors" />
                        </div>
                        <span className="text-white text-xs font-bold">{post.likes}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="p-3 bg-white/10 backdrop-blur rounded-full">
                            <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-white text-xs font-bold">1.2k</span>
                    </div>
                    <div className="p-3 bg-white/10 backdrop-blur rounded-full">
                        <Share2 className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="mb-4 space-y-3 max-w-[80%]">
                    {/* Creator Trust Badge */}
                    <div className="flex items-center gap-2">
                        <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
                            <Avatar className="w-6 h-6 border border-white">
                                <AvatarImage src={post.creator_avatar} />
                                <AvatarFallback>{post.creator_name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-white font-bold text-sm">@{post.creator_name}</span>
                        </div>
                        {post.trust_score > 80 && (
                            <Badge variant="secondary" className="bg-green-500/90 hover:bg-green-500 text-white border-0 gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                {post.trust_score.toFixed(0)} Trust Score
                            </Badge>
                        )}
                    </div>

                    <p className="text-white text-sm line-clamp-2 drop-shadow-md">
                        {post.caption}
                    </p>

                    {/* Product Link / Checkout */}
                    <div className="bg-white/10 backdrop-blur p-3 rounded-xl border border-white/20 flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm line-clamp-1">{post.product_title}</span>
                            <span className="text-yellow-400 font-bold text-xs">${post.product_price.toFixed(2)}</span>
                        </div>
                        <OneTapCheckout productTitle={post.product_title} price={post.product_price} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function VideoFeed() {
    const [posts, setPosts] = useState<SocialPost[]>([]);

    useEffect(() => {
        // Fetch Feed
        fetch('http://localhost:8000/api/v1/social/feed?user_id=me')
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="w-full h-[calc(100vh-64px)] overflow-y-scroll snap-y snap-mandatory bg-black">
            {posts.map(post => (
                <div key={post.id} className="h-full w-full snap-start">
                    <VideoPost post={post} />
                </div>
            ))}
        </div>
    );
}
