"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"

export default function AddToCartButton({ productId }: { productId: string }) {
    const { addItem } = useCart()
    const { user } = useAuth()
    const router = useRouter()

    const handleAddToCart = () => {
        if (!user) {
            router.push('/auth/login')
            return
        }

        addItem.mutate({ productId, quantity: 1 })
    }

    return (
        <Button
            onClick={handleAddToCart}
            disabled={addItem.isPending}
            className="w-full md:w-auto"
        >
            {addItem.isPending ? 'Adding...' : 'Add to Cart'}
        </Button>
    )
}
