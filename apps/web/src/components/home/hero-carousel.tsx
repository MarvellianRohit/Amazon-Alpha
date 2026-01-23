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
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MascotRunner } from "@/components/mascot/mascot-runner"
import { MagneticButton } from "@/components/ui/magnetic-button"

export default function HeroCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    const slides = [
        {
            title: "Summer Collection",
            subtitle: "AI-Curated picks just for you.",
            bg: "bg-gradient-to-r from-orange-100 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20",
            accent: "text-orange-600 dark:text-orange-400",
            image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500&q=80" // Blue Shoe
        },
        {
            title: "Tech Revolution",
            subtitle: "Next-gen electronics with 50% off.",
            bg: "bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/20",
            accent: "text-blue-600 dark:text-blue-400",
            image: "https://images.unsplash.com/photo-1593642632823-8f785667771b?w=500&q=80" // Laptop
        },
        {
            title: "Home Sanctuary",
            subtitle: "Upgrade your living space today.",
            bg: "bg-gradient-to-r from-emerald-100 to-green-50 dark:from-emerald-950/40 dark:to-green-950/20",
            accent: "text-emerald-600 dark:text-emerald-400",
            image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80" // Chair
        },
    ]

    return (
        <div className="relative w-full max-w-6xl mx-auto group">
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
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <Card className="border-0 shadow-none bg-transparent">
                                    <CardContent className={`flex flex-col-reverse md:flex-row aspect-auto md:aspect-[21/9] min-h-[500px] md:min-h-[400px] items-center justify-between p-6 md:p-12 ${slide.bg} rounded-3xl relative overflow-hidden`}>

                                        {/* Animated Background Elements */}
                                        <motion.div
                                            className="absolute top-10 right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl"
                                            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        />

                                        {/* Text Content */}
                                        <div className="text-center md:text-left relative z-10 max-w-lg space-y-6 mt-8 md:mt-0">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-sm font-medium ${slide.accent} mb-4`}>
                                                    <Sparkles className="w-4 h-4" /> Featured Drop
                                                </span>
                                            </motion.div>

                                            <motion.h2
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2, type: "spring" }}
                                                className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100"
                                            >
                                                {slide.title}
                                            </motion.h2>

                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                                className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-light"
                                            >
                                                {slide.subtitle}
                                            </motion.p>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 }}
                                                className="pt-4 flex justify-center md:justify-start"
                                            >
                                                <MagneticButton>
                                                    <Button size="lg" className="rounded-full px-8 text-lg h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                                                        Explore Now <ArrowRight className="ml-2 w-5 h-5" />
                                                    </Button>
                                                </MagneticButton>
                                            </motion.div>
                                        </div>

                                        {/* Holographic Product Image */}
                                        <motion.div
                                            className="relative z-20 w-full md:w-1/3 h-[200px] md:h-full flex items-center justify-center"
                                            initial={{ opacity: 0, x: 50, rotateY: 90 }}
                                            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                                            transition={{ delay: 0.3, duration: 0.8 }}
                                        >
                                            <motion.img
                                                src={slide.image}
                                                alt={slide.title}
                                                className="object-contain w-auto h-full max-h-[300px] drop-shadow-2xl"
                                                animate={{
                                                    y: [0, -20, 0],
                                                    filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
        </div>
    )
}
