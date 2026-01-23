
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Truck, ShieldCheck, Heart, Share2, ArrowLeft, Search, ShoppingCart, User, Menu } from "lucide-react"
import { PRODUCTS } from "@/lib/mock-data"
import { Price } from "@/components/ui/price"
import { ProductGallery } from "@/components/product/product-gallery"

// This is a dynamic route component
export default async function ProductPage({ params }: { params: { id: string } }) {
    // In a real app we'd await params, but for mock we just use it
    const { id } = await params
    const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0]

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
            {/* Reusing Header for consistency (Componentize this later) */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center mx-auto px-4">
                    <div className="mr-8 hidden md:flex">
                        <Link href="/" className="mr-6 flex items-center space-x-2">
                            <span className="hidden font-bold sm:inline-block text-xl">
                                Amazon<span className="text-primary">Alpha</span>
                            </span>
                        </Link>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
                            <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">Products</Link>
                            <Link href="/categories" className="transition-colors hover:text-foreground/80 text-foreground/60">Categories</Link>
                        </nav>
                    </div>
                    <Button variant="outline" size="icon" className="mr-2 md:hidden">
                        <Menu className="h-4 w-4" />
                    </Button>
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <div className="w-full flex-1 md:w-auto md:flex-none">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search products..." className="pl-8 w-full md:w-[300px]" />
                            </div>
                        </div>
                        <nav className="flex items-center space-x-2">
                            <Link href="/cart">
                                <Button variant="ghost" size="icon">
                                    <ShoppingCart className="h-4 w-4" />
                                    <span className="sr-only">Cart</span>
                                </Button>
                            </Link>
                            <Link href="/account">
                                <Button variant="ghost" size="icon">
                                    <User className="h-4 w-4" />
                                    <span className="sr-only">Account</span>
                                </Button>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="container py-8 mx-auto px-4 flex-1">
                <div className="mb-6">
                    <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Images */}
                    <ProductGallery
                        images={[product.image, product.image, product.image, product.image]}
                        isDigitalTwin={product.isDigitalTwin}
                        name={product.name}
                    />

                    {/* Right: Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold">{product.name}</h1>
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

                        <div className="prose dark:prose-invert">
                            <p>{product.description}</p>
                        </div>

                        <Card className="bg-slate-50 dark:bg-slate-900">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                    <Truck className="w-5 h-5" />
                                    <span className="font-medium">Free Delivery by Tomorrow</span>
                                </div>
                                <div className="space-y-2">
                                    <Button size="lg" className="w-full">Add to Cart</Button>
                                    <Button size="lg" variant="secondary" className="w-full">Buy Now</Button>
                                </div>
                                <div className="flex items-center justify-center space-x-4 pt-2">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                                        <Heart className="w-4 h-4 mr-2" /> Save
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
