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
import Image from "next/image"

export default function HeroCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    )

    const slides = [
        { title: "Summer Collection", desc: "AI-Curated picks just for you.", bg: "bg-orange-100" },
        { title: "Tech Deals", desc: "Up to 50% off on Electronics.", bg: "bg-blue-100" },
        { title: "Home Refresh", desc: "Upgrade your living space.", bg: "bg-green-100" },
    ]

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-5xl mx-auto"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {slides.map((slide, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardContent className={`flex aspect-[21/9] items-center justify-center p-6 ${slide.bg} rounded-xl`}>
                                    <div className="text-center">
                                        <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                                        <p className="text-xl text-gray-700">{slide.desc}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
