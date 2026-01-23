
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { PRODUCTS } from "@/lib/mock-data"
import { toast } from "sonner"

// Types
type Product = typeof PRODUCTS[0]

interface CartItem {
    id: string
    product: Product
    quantity: number
}

interface CartContextType {
    cart: { items: CartItem[] } | null
    isLoading: boolean
    addItem: (params: { productId: string, quantity: number }) => void
    removeItem: (itemId: string) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Load from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("alpha_cart")
        if (saved) {
            try {
                setItems(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse cart", e)
            }
        }
        setIsLoading(false)
    }, [])

    // Save to LocalStorage on change
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem("alpha_cart", JSON.stringify(items))
        }
    }, [items, isLoading])

    const addItem = ({ productId, quantity }: { productId: string, quantity: number }) => {
        const product = PRODUCTS.find(p => p.id === productId)
        if (!product) {
            toast.error("Product not found")
            return
        }

        setItems(prev => {
            const existing = prev.find(item => item.product.id === productId)
            if (existing) {
                toast.success(`Updated ${product.name} quantity`)
                return prev.map(item =>
                    item.product.id === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }
            toast.success(`Added ${product.name} to cart`)
            return [...prev, { id: `item_${Date.now()}`, product, quantity }]
        })
    }

    const removeItem = (itemId: string) => {
        setItems(prev => prev.filter(item => item.id !== itemId))
        toast.success("Removed item from cart")
    }

    const clearCart = () => {
        setItems([])
        toast.info("Cart cleared")
    }

    // derived cart object to match existing API shape
    const cart = { items }

    return (
        <CartContext.Provider value={{ cart, isLoading, addItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCartContext = () => {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCartContext must be used within a CartProvider")
    }
    return context
}
