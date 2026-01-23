import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Sparkles } from "lucide-react"
import { CATEGORIES, PRODUCTS } from "@/lib/mock-data"
import { Price } from "@/components/ui/price"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import HeroCarousel from "@/components/home/hero-carousel"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-12">
          <HeroCarousel />
        </section>

        {/* Featured Categories */}
        <section className="container py-8 md:py-12 lg:py-24 mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.id}`}>
                <SpotlightCard className="group aspect-square h-full">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-white text-xl font-bold">{cat.name}</h3>
                  </div>
                </SpotlightCard>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="container py-8 md:py-12 lg:py-24 mx-auto px-4 bg-slate-100 dark:bg-slate-900/50 rounded-3xl my-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="text-muted-foreground mt-2">Curated selections just for you</p>
            </div>
            <Button variant="ghost">View All</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="h-full overflow-hidden transition-all hover:shadow-lg border-none ring-1 ring-slate-200 dark:ring-slate-800">
                  <div className="aspect-square relative bg-white dark:bg-slate-800">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                    />
                    {product.badge && (
                      <Badge className="absolute top-2 right-2 bg-blue-600 text-white">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                    <h3 className="font-semibold text-lg line-clamp-2 mb-2 h-14">{product.name}</h3>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-col">
                        <div className="text-xl font-bold">
                          <Price amount={product.price} />
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            <Price amount={product.originalPrice} />
                          </div>
                        )}
                      </div>
                      <Button size="sm">Add</Button>
                    </div>
                    {product.isDigitalTwin && (
                      <div className="mt-3 flex items-center text-xs text-purple-600 dark:text-purple-400 font-medium">
                        <Sparkles className="h-3 w-3 mr-1" /> Digital Twin Verified
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
