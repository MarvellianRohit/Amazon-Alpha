"use client"

import Link from "next/link"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Truck, ShieldCheck, Heart, Share2, ArrowLeft, DollarSign } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { NegotiationChat } from "@/components/ai/negotiation-chat"
import { PRODUCTS } from "@/lib/mock-data"
import { Price } from "@/components/ui/price"
import { ProductGallery } from "@/components/product/product-gallery"
import { Navbar } from "@/components/layout/navbar"
import { useCart } from "@/hooks/use-cart"
import { motion } from "framer-motion"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0]
    const { addItem } = useCart()

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main className="container py-8 mx-auto px-4 flex-1">
                <div className="mb-6">
                    <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Images with Holographic Glow */}
                    <div className="relative group/gallery">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-700" />
                        <ProductGallery
                            images={[product.image, product.image, product.image, product.image]}
                            isDigitalTwin={product.isDigitalTwin}
                            name={product.name}
                        />
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-6">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-3xl font-bold"
                            >
                                {product.name}
                            </motion.h1>
                            <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center text-yellow-500">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-bold ml-1">{product.rating}</span>
                                </div>
                                <span className="text-muted-foreground">{product.reviews} reviews</span>
                                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                    {product.category}
                                </Badge>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-baseline space-x-2">
                            <div className="text-4xl font-bold"><Price amount={product.price} /></div>
                            {product.originalPrice && (
                                <div className="text-lg text-muted-foreground line-through">
                                    <Price amount={product.originalPrice} />
                                </div>
                            )}
                        </div>

                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50/30 dark:bg-indigo-950/20 rounded-r-lg">
                                {product.description}
                            </p>
                        </div>

                        <Card className="bg-slate-50 dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                    <Truck className="w-5 h-5" />
                                    <span className="font-medium">Free Delivery by Tomorrow</span>
                                </div>
                                <div className="space-y-3">
                                    <Button
                                        size="lg"
                                        className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-95"
                                        onClick={() => {
                                            addItem.mutate({ productId: product.id, quantity: 1 });
                                            import('canvas-confetti').then(confetti => {
                                                confetti.default({
                                                    particleCount: 150,
                                                    spread: 80,
                                                    origin: { y: 0.7 },
                                                    colors: ['#6366f1', '#a855f7', '#ec4899']
                                                });
                                            });
                                        }}
                                    >
                                        Add to Cart
                                    </Button>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                size="lg"
                                                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20 border-0"
                                            >
                                                <DollarSign className="w-5 h-5 mr-2" />
                                                Make an Offer
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[500px]">
                                            <DialogHeader>
                                                <DialogTitle>Negotiate Price</DialogTitle>
                                                <DialogDescription>
                                                    Chat with our AI agent to negotiate a better deal for this item.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <NegotiationChat productId={product.id} initialPrice={product.price} />
                                        </DialogContent>
                                    </Dialog>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full h-14 text-lg font-bold border-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                                        asChild
                                    >
                                        <Link href={`/simulator?productId=${product.id}`}>
                                            Inspect in Holodeck
                                        </Link>
                                    </Button>
                                </div>
                                <div className="flex items-center justify-center space-x-4 pt-2">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                                        <Heart className="w-4 h-4 mr-2" /> Save to Wishlist
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                                        <Share2 className="w-4 h-4 mr-2" /> Share
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="specs">
                            <TabsList className="w-full">
                                <TabsTrigger value="specs" className="flex-1">Specifications</TabsTrigger>
                                <TabsTrigger value="history" className="flex-1">Provenance</TabsTrigger>
                            </TabsList>
                            <TabsContent value="specs" className="mt-4">
                                <div className="space-y-2">
                                    {product.specs?.map((spec: string, i: number) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                                            <span className="font-medium text-sm">{spec}</span>
                                            <span className="text-muted-foreground text-sm">Yes</span>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="history" className="mt-4">
                                <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-4 font-mono text-xs space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Contract:</span>
                                        <span>{product.nftContract || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Token ID:</span>
                                        <span>#{product.id.split('_')[1]}4920</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Minter:</span>
                                        <span>Official Brand Store</span>
                                    </div>
                                    <div className="text-green-600 dark:text-green-400 flex items-center mt-2">
                                        <ShieldCheck className="w-3 h-3 mr-1" /> Blockchain Verified
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    )
}
