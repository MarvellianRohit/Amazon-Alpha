
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CATEGORIES } from "@/lib/mock-data"
import { ArrowRight } from "lucide-react"

export default function CategoriesPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Shop by Category</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Explore our wide range of premium products across various tailored collections.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {CATEGORIES.map((cat) => {
                        const slug = cat.name.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')
                        return (
                            <Link key={cat.id} href={`/category/${slug}`} className="group">
                                <Card className="overflow-hidden border-none shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                                    <div className="relative h-64 w-full">
                                        <Image
                                            src={cat.image}
                                            alt={cat.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                                            <h2 className="text-white text-2xl font-bold mb-1">{cat.name}</h2>
                                            <div className="flex items-center text-white/80 text-sm font-medium opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}

                    {/* Mock extra categories to fill grid */}
                    <Link href="/category/new" className="group">
                        <Card className="h-full border-dashed border-2 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center min-h-[256px]">
                            <div className="text-center text-muted-foreground">
                                <p className="font-medium">More Categories</p>
                                <p className="text-xs">Coming Soon</p>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )
}
