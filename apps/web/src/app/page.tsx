import { SwipeableProductCard } from "@/components/tablet/swipeable-product-card"
import { RecommendedSection } from "@/components/home/recommended-section"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import HeroCarousel from "@/components/home/hero-carousel"

async function getProducts() {
  // Fetch products from backend for SSR
  try {
    const res = await fetch('http://127.0.0.1:8000/api/products/', {
      cache: 'no-store' // Dynamic data
    })
    if (!res.ok) return []
    return res.json()
  } catch (e) {
    return []
  }
}

export default async function Home() {
  const products = await getProducts()

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-10 bg-gray-50 border-b">
        <HeroCarousel />
      </section>

      {/* Recommendations */}
      <RecommendedSection />

      {/* Product Grid */}
      <section id="products" className="py-20 container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="#" className="hidden text-sm font-semibold text-blue-600 hover:text-blue-500 sm:block">
            Browse all categories <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No products found. Be the first to list one!</p>
            <Button variant="link" asChild className="mt-4">
              <Link href="/vendor/products/new">Sell a Product</Link>
            </Button>
          </div>
        ) : (
          /* Responsive Grid: 2-Items on Tablet (md), 4-Items on Desktop (lg) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product: any) => (
              <SwipeableProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
