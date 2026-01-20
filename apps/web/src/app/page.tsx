import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ShoppingCart, User, Menu, Star, Sparkles, TrendingUp } from "lucide-react"
import { CATEGORIES, PRODUCTS } from "@/lib/mock-data"
import { Price } from "@/components/ui/price"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
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
              <Link href="/deals" className="transition-colors hover:text-foreground/80 text-foreground/60">Deals</Link>
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 bg-gradient-to-r from-blue-600 to-violet-600 text-white dark:from-blue-900 dark:to-violet-900">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto px-4">
            <Badge variant="secondary" className="rounded-full px-4 py-1 text-sm bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 text-yellow-300" />
              AI-Powered Shopping is Here
            </Badge>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              The Future of E-Commerce
            </h1>
            <p className="max-w-[42rem] leading-normal text-white/80 sm:text-xl sm:leading-8">
              Experience a marketplace built for agents and humans alike. Verified provenance, AI negotiations, and seamless crypto payments.
            </p>
            <div className="space-x-4">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Shopping <TrendingUp className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 hover:text-white">
                Sell a Product
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="container py-8 md:py-12 lg:py-24 mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.id}`} className="group relative overflow-hidden rounded-lg aspect-square">
                <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white text-xl font-bold">{cat.name}</h3>
                </div>
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

      <footer className="border-t bg-slate-950 text-slate-50 py-12">
        <div className="container px-4 mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>All Products</li>
              <li>Electronics</li>
              <li>Clothing</li>
              <li>Home</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Help Center</li>
              <li>Returns</li>
              <li>Contact Us</li>
              <li>Shipping Status</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Amazon Alpha</h4>
            <p className="text-sm text-slate-400">
              The next generation of e-commerce, powered by AI and Blockchain technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
