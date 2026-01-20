
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Timer, Zap, Star } from "lucide-react"
import { PRODUCTS } from "@/lib/mock-data"

export default function DealsPage() {
    // Filter products that have a discount
    const deals = PRODUCTS.filter(p => p.originalPrice && p.originalPrice > p.price)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
            {/* Hero Banner for Deals */}
            <section className="container mx-auto px-4 mb-12">
                <div className="rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <Badge className="bg-white/20 hover:bg-white/30 text-white mb-4 border-none">
                            <Zap className="mr-2 h-4 w-4 fill-yellow-300 text-yellow-300" /> Lightning Deals
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">Flash Sale ends in 02:45:12</h1>
                        <p className="text-lg text-white/90 mb-8">
                            Grab verified tech and premium goods at unbeatable prices. Limited quantities available.
                        </p>
                        <Button size="lg" variant="secondary" className="font-bold">
                            Shop All Deals
                        </Button>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-fullblur-3xl -mr-16 -mt-16"></div>
                </div>
            </section>

            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Timer className="mr-2 h-6 w-6 text-red-500" /> Trending Offers
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {deals.map((product) => {
                        const discount = product.originalPrice
                            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                            : 0

                        return (
                            <Link key={product.id} href={`/product/${product.id}`}>
                                <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:border-red-200 dark:hover:border-red-900 group">
                                    <div className="aspect-square relative bg-white dark:bg-slate-800 p-4">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain"
                                        />
                                        <Badge className="absolute top-2 left-2 bg-red-600 text-white font-bold">
                                            -{discount}%
                                        </Badge>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-1 mb-2">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs font-medium">{product.rating}</span>
                                            <span className="text-xs text-muted-foreground">({product.reviews})</span>
                                        </div>
                                        <h3 className="font-medium line-clamp-2 h-10 mb-2 group-hover:text-red-600 transition-colors">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-end justify-between mt-2">
                                            <div>
                                                <div className="flex items-baseline space-x-2">
                                                    <span className="text-lg font-bold text-red-600">${product.price}</span>
                                                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                                                </div>
                                                <p className="text-xs text-green-600 mt-1">Free Shipping</p>
                                            </div>
                                            <Button size="sm" variant="outline" className="h-8">Grab It</Button>
                                        </div>

                                        <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-red-500 h-full w-[85%]"></div>
                                        </div>
                                        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                                            <span>85% Claimed</span>
                                            <span>Only 4 left</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
