
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Book } from "lucide-react"

export default function TextbooksPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="container mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center">
                            <Book className="mr-3 h-8 w-8 text-indigo-600" /> Campus Books
                        </h1>
                        <p className="text-muted-foreground">Buy, sell, and rent textbooks from other students.</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-2">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search ISBN, Title..." className="pl-8" />
                        </div>
                        <Button>Sell a Book</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="hover:shadow-lg transition-shadow">
                            <div className="aspect-[3/4] bg-slate-200 relative">
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold text-lg">
                                    BOOK COVERS
                                </div>
                                <Badge className="absolute top-2 right-2 bg-green-600">Used - Good</Badge>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-bold line-clamp-1">Introduction to Algorithms</h3>
                                <p className="text-sm text-muted-foreground">Cormen, Leiserson, Rivest</p>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-lg font-bold">$45.00</span>
                                    <span className="text-xs text-muted-foreground line-through">$120.00</span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full" size="sm">Add to Cart</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
