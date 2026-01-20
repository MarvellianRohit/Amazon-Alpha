
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PRODUCTS, CATEGORIES } from "@/lib/mock-data"
import { ShoppingCart, Star, ArrowLeft } from "lucide-react"
import { Price } from "@/components/ui/price"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug: rawSlug } = await params;
    // Decode and normalize slug
    const slug = decodeURIComponent(rawSlug).toLowerCase() // e.g., "home-&-smart"

    // Find category matching the slug (fuzzy match for simplicity)
    // "Home & Smart" -> "home", "smart", "home-&-smart"
    const category = CATEGORIES.find(c =>
        c.name.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and') === slug ||
        c.name.toLowerCase().includes(slug.replace(/-/g, ' '))
    )

    if (!category) {
        // Fallback: Check if any product has this category name directly
        const hasProducts = PRODUCTS.some(p => p.category.toLowerCase().replace(/ /g, '-') === slug)
        if (!hasProducts) return notFound()
    }

    const categoryName = category ? category.name : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    // Filter products
    const categoryProducts = PRODUCTS.filter(product =>
        product.category.toLowerCase().includes(categoryName.toLowerCase()) ||
        categoryName.toLowerCase().includes(product.category.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <div className="relative h-[300px] w-full overflow-hidden">
                <Image
                    src={category?.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop"}
                    alt={categoryName}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-6">
                    <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                        Collection
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{categoryName}</h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        Discover our curated selection of top-tier {categoryName.toLowerCase()}.
                    </p>
                </div>
            </div>

            {/* Breadcrumb / Back */}
            <div className="container mx-auto px-4 py-8">
                <Link href="/categories" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Categories
                </Link>

                {/* Product Grid */}
                {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categoryProducts.map((product) => (
                            <Card key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300">
                                <Link href={`/product/${product.id}`}>
                                    <div className="relative aspect-square bg-white">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {product.badge && (
                                            <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600 text-white border-none">
                                                {product.badge}
                                            </Badge>
                                        )}
                                    </div>
                                </Link>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-1 mb-2 text-amber-500 text-sm">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="font-medium text-foreground">{product.rating}</span>
                                        <span className="text-muted-foreground">({product.reviews})</span>
                                    </div>
                                    <Link href={`/product/${product.id}`} className="group-hover:text-primary transition-colors">
                                        <h3 className="font-medium text-lg line-clamp-2 h-14 leading-tight mb-2">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex flex-col">
                                            <div className="text-2xl font-bold">
                                                <Price amount={product.price} />
                                            </div>
                                            {product.originalPrice && (
                                                <div className="text-sm text-muted-foreground line-through">
                                                    <Price amount={product.originalPrice} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Button className="w-full gap-2 font-medium">
                                        <ShoppingCart className="w-4 h-4" />
                                        Add to Cart
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-xl font-semibold mb-2">No products found</h2>
                        <p className="text-muted-foreground">
                            We currently don't have any matching products in this category. Check back soon!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
