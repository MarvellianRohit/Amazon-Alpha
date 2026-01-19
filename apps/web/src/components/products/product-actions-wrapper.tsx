"use client"

import StickyBuyBar from "./sticky-buy-bar"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"

export default function ProductActionsWrapper({ product }: { product: any }) {
    const { addItem } = useCart()
    const router = useRouter()

    const handleAddToCart = () => {
        // We need 'user' context? useCart handles it if we modify it or basic check.
        // Assuming addItem handles auth check or throws.
        // Actually our addItem hook throws if no session?
        // Let's just call it.
        addItem.mutate({ productId: product.id, quantity: 1 })
    }

    return (
        <StickyBuyBar product={product} onAddToCart={handleAddToCart} />
    )
}
