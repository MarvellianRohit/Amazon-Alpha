
"use client"

import { useCartContext } from "@/components/providers/cart-provider"

// Adapter hook to maintain backward compatibility with the existing calling code
export function useCart() {
    const { cart, isLoading, addItem, removeItem } = useCartContext()

    return {
        cart,
        isLoading,
        error: null,
        // The existing components expect addItem to be a mutation object with .mutate({ productId, quantity })
        // But some might call addItem(productId, quantity) directly?
        // Looking at previous code, it returned 'addItem' as a mutation object.
        // Let's emulate the mutation interface roughly.
        addItem: {
            mutate: (variables: { productId: string, quantity: number }) => addItem(variables),
            isPending: false
        },
        removeItem: {
            mutate: (itemId: string) => removeItem(itemId),
            isPending: false
        }
    }
}
