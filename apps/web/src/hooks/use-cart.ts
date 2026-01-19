"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// Types (should match Backend Pydantic)
// We fetch from our API, so response is JSON matching Pydantic
type Product = {
    id: string
    title: string
    price: number
    stock: number
    description?: string
    images?: string[]
    vendor_id?: string // Added for split shipping
    vendor_name?: string // Added for split shipping
}

type CartItem = {
    id: string
    product: Product
    quantity: number
}

type Cart = {
    id: string
    user_id: string
    items: CartItem[]
}

// Fetch Cart Function
async function fetchCart() {
    // In Client Component, we can fetch our API directly
    // Ideally use an ENV var for API URL, but for now hardcode/relative
    // Since we are on same domain (Next.js), if we had Next API routes proxying backend we'd use /api/...
    // But we are hitting Backend directly (CORS allowed).

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return null // Or throw?

    const res = await fetch('http://127.0.0.1:8000/api/cart/', {
        headers: {
            'Authorization': `Bearer ${session.access_token}`
        }
    })

    if (!res.ok) {
        throw new Error('Failed to fetch cart')
    }

    const cart = await res.json() as Cart

    // MOCK: Inject vendor_id if missing for testing Split Shipping
    // In production, backend should return this.
    // We'll assign items randomly to "Vendor A" or "Vendor B" if no ID exists.
    cart.items = cart.items.map((item, index) => {
        if (!item.product.vendor_id) {
            const isVendorA = index % 2 === 0;
            item.product.vendor_id = isVendorA ? 'vendor-a' : 'vendor-b';
            item.product.vendor_name = isVendorA ? 'TechGiant Inc.' : 'HomeGoods Co.';
        }
        return item;
    });

    return cart
}

async function addToCart({ productId, quantity }: { productId: string, quantity: number }) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not logged in")

    const res = await fetch('http://127.0.0.1:8000/api/cart/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ product_id: productId, quantity })
    })

    if (!res.ok) throw new Error('Failed to add to cart')
    return res.json()
}

async function removeFromCart(itemId: string) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not logged in")

    const res = await fetch(`http://127.0.0.1:8000/api/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${session.access_token}`
        }
    })

    if (!res.ok) throw new Error('Failed to remove from cart')
    return res.json()
}


export function useCart() {
    const queryClient = useQueryClient()

    const cartQuery = useQuery({
        queryKey: ['cart'],
        queryFn: fetchCart,
        retry: false
    })

    const addItem = useMutation({
        mutationFn: addToCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })

    const removeItem = useMutation({
        mutationFn: removeFromCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })

    return {
        cart: cartQuery.data,
        isLoading: cartQuery.isLoading,
        error: cartQuery.error,
        addItem,
        removeItem
    }
}
