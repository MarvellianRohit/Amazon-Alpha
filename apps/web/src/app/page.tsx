"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Sparkles, ArrowRight } from "lucide-react"
import { CATEGORIES, PRODUCTS } from "@/lib/mock-data"
import { Price } from "@/components/ui/price"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import HeroCarousel from "@/components/home/hero-carousel"
import { motion } from "framer-motion"
import { StaggerList } from "@/components/ui/stagger-list"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 relative overflow-hidden">

      {/* Dynamic Background Aura */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-12"
        >
          <HeroCarousel />
        </motion.section>

        {/* Featured Categories */}
        <section className="container py-8 md:py-12 lg:py-24 mx-auto px-4">
          <div className="flex flex-col mb-10">
            <h2 className="text-4xl font-black tracking-tight mb-2 uppercase italic text-slate-900 dark:text-white">
              Shop <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Departments</span>
            </h2>
            <div className="h-1 w-20 bg-indigo-600 rounded-full" />
          </div>

          <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.id}`} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500 group-hover:duration-200" />
                <SpotlightCard className="group relative aspect-square h-full overflow-hidden rounded-2xl border-none shadow-xl">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-2xl font-black tracking-tight">{cat.name}</h3>
                    <p className="text-white/60 text-xs mt-1 transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">Explore Collection →</p>
                  </div>
                </SpotlightCard>
              </Link>
            ))}
          </StaggerList>
        </section>

        {/* Featured Products */}
        <section className="container py-12 md:py-20 mx-auto px-4 bg-white dark:bg-slate-900 shadow-2xl rounded-[3rem] my-12 border border-slate-200 dark:border-slate-800 relative group overflow-hidden">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#6366f1 1px, transparent 0)", backgroundSize: "40px 40px" }} />

          <div className="flex items-end justify-between mb-12 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-px bg-indigo-500" />
                <span className="text-indigo-500 font-bold text-xs uppercase tracking-widest">Hand-picked</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter">PREMIUM <span className="text-indigo-600">EDITIONS</span></h2>
              <p className="text-muted-foreground mt-3 max-w-md">Our latest verified digital twin collection with exclusive student pricing.</p>
            </div>
            <Button variant="outline" className="rounded-full border-2 border-indigo-500/30 hover:bg-indigo-500 hover:text-white transition-all px-8 h-12 font-bold gap-2">
              View Collection <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {PRODUCTS.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <div className="h-full bg-slate-50 dark:bg-slate-800/50 rounded-3xl overflow-hidden transition-all duration-500 border border-transparent hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/20 flex flex-col">
                  <div className="aspect-square relative flex items-center justify-center p-8 bg-white dark:bg-slate-800">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.badge && (
                      <Badge className="absolute top-4 right-4 bg-indigo-600 text-white font-bold px-3 py-1 rounded-full shadow-lg">
                        {product.badge}
                      </Badge>
                    )}
                    {product.isDigitalTwin && (
                      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter flex items-center border border-indigo-500/20 shadow-sm">
                        <Sparkles className="h-3 w-3 mr-1 text-indigo-500" /> DT-Verified
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center space-x-1 mb-3 opacity-60">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 border-none" />
                      <span className="text-xs font-bold">{product.rating}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">({product.reviews})</span>
                    </div>
                    <h3 className="font-bold text-xl leading-snug line-clamp-2 mb-4 h-14 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                    <div className="mt-auto flex items-end justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex flex-col">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">MSRP</p>
                        <div className="text-2xl font-black tracking-tight">
                          <Price amount={product.price} />
                        </div>
                      </div>
                      <Button size="icon" className="h-12 w-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-110 transition-transform shadow-xl">
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Link>
            ))}
          </StaggerList>
        </section>
      </main>
    </div>
  )
}
