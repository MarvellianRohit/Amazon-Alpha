"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MascotRunner } from "@/components/mascot/mascot-runner"
import { MagneticButton } from "@/components/ui/magnetic-button"

function HeroSlide({ slide }: { slide: any }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-250, 250], [15, -15]), { damping: 25, stiffness: 200 });
    const rotateY = useSpring(useTransform(mouseX, [-250, 250], [-15, 15]), { damping: 25, stiffness: 200 });

    function handleMouseMove(e: React.MouseEvent) {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    }

    function handleMouseLeave() {
        mouseX.set(0);
        mouseY.set(0);
    }

    return (
        <Card className="border-0 shadow-none bg-transparent" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <CardContent className={`flex flex-col-reverse md:flex-row aspect-auto md:aspect-[21/9] min-h-[500px] md:min-h-[450px] items-center justify-between p-6 md:p-16 ${slide.bg} rounded-[3rem] relative overflow-hidden transition-all duration-700`}>

                {/* Dynamic Ambient Glow */}
                <motion.div
                    className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -z-10"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />

                <div className="text-center md:text-left relative z-10 max-w-xl space-y-8 mt-8 md:mt-0">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-[10px] font-black uppercase tracking-[0.2em] ${slide.accent} border border-white/20 shadow-xl`}>
                            <Sparkles className="w-3.5 h-3.5 fill-current" /> Next-Gen Alpha Drop
                        </span>
                    </motion.div>

                    <div className="space-y-4">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, type: "spring", damping: 15 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-slate-100 leading-[0.9] uppercase italic"
                        >
                            {slide.title}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-medium opacity-60 leading-relaxed max-w-md"
                        >
                            {slide.subtitle}
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="pt-4 flex justify-center md:justify-start"
                    >
                        <MagneticButton>
                            <Button size="lg" className="rounded-2xl px-12 text-lg h-16 shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-indigo-500/30 transition-all hover:scale-105 font-black uppercase tracking-widest bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-none">
                                Explore <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </MagneticButton>
                    </motion.div>
                </div>

                {/* 3D Parallax Hero Image */}
                <motion.div
                    className="relative z-20 w-full md:w-1/2 h-[300px] md:h-full flex items-center justify-center perspective-2000"
                    style={{ rotateX, rotateY }}
                    initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: 0.3, duration: 1.2, type: "spring", bounce: 0.4 }}
                >
                    <motion.img
                        src={slide.image}
                        alt={slide.title}
                        className="object-contain w-auto h-full max-h-[400px] drop-shadow-[0_40px_80px_rgba(0,0,0,0.4)] relative z-10"
                        animate={{
                            y: [0, -25, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Immersive Depth Layers */}
                    <div className="absolute inset-0 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/10 rounded-full -z-20 scale-150 rotate-45" />
                </motion.div>
            </CardContent>
        </Card>
    );
}

export default function HeroCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 6000, stopOnInteraction: true })
    )

    const slides = [
        {
            title: "Alpha Force",
            subtitle: "Verified performance. Sculpted for speed.",
            bg: "bg-gradient-to-br from-indigo-100 via-white to-blue-50 dark:from-slate-900 dark:to-indigo-950/40",
            accent: "text-indigo-600 dark:text-indigo-400",
            image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=90"
        },
        {
            title: "Cyber Core",
            subtitle: "The epicenter of your digital workflow.",
            bg: "bg-gradient-to-br from-slate-100 via-white to-indigo-50 dark:from-slate-950 dark:to-slate-900",
            accent: "text-slate-900 dark:text-purple-400 font-black",
            image: "https://images.unsplash.com/photo-1593642632823-8f785667771b?w=800&q=90"
        },
        {
            title: "Neo Living",
            subtitle: "Bespoke tranquility for the modern explorer.",
            bg: "bg-gradient-to-br from-emerald-100 via-white to-green-50 dark:from-emerald-950/40 dark:to-slate-900",
            accent: "text-emerald-700 dark:text-emerald-400",
            image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=90"
        },
    ]

    return (
        <div className="relative w-full max-w-7xl mx-auto group px-4">
            <MascotRunner />
            <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={index} className="pt-4 pb-8">
                            <HeroSlide slide={slide} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-8 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-slate-900 hover:text-white border-2 border-slate-200 dark:border-slate-800" />
                <CarouselNext className="right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-slate-900 hover:text-white border-2 border-slate-200 dark:border-slate-800" />
            </Carousel>
        </div>
    )
}
