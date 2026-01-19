import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type ProductCardProps = {
    id: string
    title: string
    price: number
    image?: string
    category: string
}

export default function ProductCard({ id, title, price, image, category }: ProductCardProps) {
    return (
        <Card className="h-full flex flex-col transition-all hover:shadow-lg">
            <CardHeader className="p-0">
                <div className="aspect-square bg-gray-100 relative rounded-t-lg overflow-hidden flex items-center justify-center">
                    {/* Placeholder for real image */}
                    <span className="text-gray-400">Product Image</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{category}</p>
                <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">{title}</h3>
                <p className="text-xl font-bold">${price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full">
                    <Link href={`/products/${id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
