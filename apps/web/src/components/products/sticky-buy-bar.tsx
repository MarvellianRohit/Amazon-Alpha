"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'

export default function StickyBuyBar({
    product,
    onAddToCart
}: {
    product: any,
    onAddToCart: () => void
}) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }
        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    if (!isVisible) return null

    return (
        <div
            className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50 animate-in slide-in-from-bottom"
            role="region"
            aria-label="Sticky product actions"
        >
            <div className="container mx-auto flex items-center justify-between">
                <div className="hidden md:flex flex-col">
                    <h3 className="font-bold text-sm truncate max-w-[200px]">{product.title}</h3>
                    <p className="text-sm font-semibold text-green-600">${product.price}</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Button onClick={onAddToCart} className="flex-1 md:flex-none">
                        Add to Cart
                    </Button>
                    <Button variant="default" className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600">
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
    )
}
