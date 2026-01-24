"use client";

import { useEffect, useState } from "react"
import { motion, useScroll } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { ProductGallery } from "@/components/pdp/product-gallery"
import { Product3DViewer } from "@/components/product/Product3DViewer"
import { ProductSpecs } from "@/components/pdp/product-specs"
import { ProductSidebar } from "@/components/pdp/product-sidebar"
import { PriceHistoryChart } from "@/components/pdp/price-history-chart"
import { PriceAlertDialog } from "@/components/pdp/price-alert-dialog"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useViewHistory } from "@/hooks/use-view-history"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Shirt, Maximize } from "lucide-react"
import Link from "next/link"
import { MobileStickyFooter } from "@/components/mobile/sticky-footer"
import { NegotiationChat } from "@/components/product/negotiation-chat"
import { Button } from "@/components/ui/button"
import { VirtualTryOn } from "@/components/product/VirtualTryOn"
import { SpatialRoomViewer } from "@/components/product/SpatialRoomViewer"
import { ProductPassport } from "@/components/blockchain/ProductPassport"

// Placeholder for search focus
const focusSearch = () => {
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput) searchInput.focus();
};

export default function ProductPage() {
    const params = useParams()
    const id = params.id as string
    const [product, setProduct] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [isStudent, setIsStudent] = useState(false); // Add Student State
    const { addItem } = useCart()
    const { addToHistory } = useViewHistory()
    const router = useRouter()
    const { scrollYProgress } = useScroll()
    const [isTryOnOpen, setIsTryOnOpen] = useState(false);
    const [isSpatialOpen, setIsSpatialOpen] = useState(false);

    // Keyboard Shortcuts
    useKeyboardShortcuts({
        "b": () => {
            if (product && (product.stock > 0)) {
                addItem.mutate({ productId: product.id, quantity: 1 });
                router.push('/checkout');
                toast.success("Express Checkout Triggered!");
            }
        },
        "/": () => {
            focusSearch();
            // Prevent default / type
            return;
        }
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Use the standardized port 8000
                const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`)
                if (!res.ok) throw new Error('Product not found')
                const data = await res.json()
                setProduct(data)
                addToHistory(id) // Track View
            } catch (err) {
                setError('Failed to load product')
            } finally {
                setIsLoading(false)
            }
        }
        if (id) fetchProduct()

        // Check for Student Status (Mock)
        // In a real app, this would be part of the user session or a specific API call
        if (typeof window !== 'undefined') {
            const verified = localStorage.getItem("is_student_verified") === "true";
            setIsStudent(verified);
        }
    }, [id])

    // Calculate Student Price if not provided by backend (Mock: 10% off)
    const studentPrice = product?.student_price || (product ? product.price * 0.9 : 0);

    const handleAddToCart = () => {
        if (product) {
            addItem.mutate({ productId: product.id, quantity: 1 })
            toast.success("Added to cart");
        }
    }

    const handleBuyNow = () => {
        if (product) {
            addItem.mutate({ productId: product.id, quantity: 1 })
            router.push('/checkout')
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="container py-10">
                <div className="text-center text-red-500">{error || 'Product not found'}</div>
                <Link href="/" className="mt-4 inline-block text-primary hover:underline">
                    &larr; Back to Products
                </Link>
            </div>
        )
    }

    // Mock Multiple Images for Gallery (Duplicate main image for demo purposes)
    const galleryImages = [
        product.image_url || '/placeholder.jpg',
        product.image_url || '/placeholder.jpg',
        product.image_url || '/placeholder.jpg',
        product.image_url || '/placeholder.jpg',
    ];

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Try On Modal */}
            {isTryOnOpen && <VirtualTryOn onClose={() => setIsTryOnOpen(false)} />}
            {isSpatialOpen && <SpatialRoomViewer onClose={() => setIsSpatialOpen(false)} />}

            {/* Breadcrumb / Back */}
            <div className="border-b bg-white relative z-20">
                <motion.div
                    style={{ scaleX: scrollYProgress }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 origin-left"
                />
                <div className="container mx-auto px-4 py-3">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Results
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 lg:py-12">
                {/* 3-Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Column 1: Gallery (Sticky) - Spans 5 cols */}
                    <div className="lg:col-span-5 sticky top-24 z-10 space-y-4">
                        <ProductGallery images={galleryImages} title={product.name} />

                        {/* 3D Viewer Integration */}
                        <div className="w-full space-y-2">
                            <h4 className="font-bold text-sm mb-2 text-neutral-500 uppercase tracking-wide">Phygital Experience</h4>
                            <Product3DViewer />

                            <Button onClick={() => setIsTryOnOpen(true)} className="w-full bg-black text-white hover:bg-neutral-800 mb-2" size="lg">
                                <Shirt className="w-4 h-4 mr-2" /> Virtual Try-On (Beta)
                            </Button>
                            <Button onClick={() => setIsSpatialOpen(true)} className="w-full bg-white text-black border border-neutral-200 hover:bg-neutral-100" size="lg">
                                <Maximize className="w-4 h-4 mr-2" /> View in My Room (LiDAR)
                            </Button>
                        </div>
                    </div>

                    {/* Column 2: Specs & Info (Scrollable) - Spans 4 cols */}
                    <div className="lg:col-span-4 min-h-[800px] space-y-8">
                        {/* Price History & Alerts */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Price Trends</h3>
                                <PriceAlertDialog productId={product.id} currentPrice={product.price} />
                            </div>
                            <PriceHistoryChart data={[{ date: 'Now', price: product.price }]} />
                        </div>

                        <ProductSpecs product={product} />
                    </div>

                    {/* Column 3: Buy Box (Sticky) - Spans 3 cols */}
                    <div className="lg:col-span-3 sticky top-24 z-10 hidden lg:block space-y-6">
                        <ProductSidebar
                            product={product}
                            isStudent={isStudent}
                            studentPrice={studentPrice}
                            onAddToCart={handleAddToCart}
                            onBuyNow={handleBuyNow}
                        />
                        <NegotiationChat
                            productId={product.id}
                            productName={product.name}
                            initialPrice={product.price}
                        />
                        <ProductPassport productId={product.id} />
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer */}
            {product && (
                <MobileStickyFooter
                    price={product.price}
                    studentPrice={studentPrice}
                    isStudent={isStudent}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    isInStock={product.stock > 0}
                />
            )}

            {/* Spacer for bottom nav/footer */}
            <div className="h-24 lg:hidden" />
        </div>
    )
}
