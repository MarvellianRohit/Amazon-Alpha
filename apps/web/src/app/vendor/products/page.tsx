"use client";

import { motion } from "framer-motion";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash, MoreHorizontal } from "lucide-react";
import { PRODUCTS } from "@/lib/mock-data";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { mintDigitalTwin } from "@/lib/web3";

export default function VendorProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleMint = async (product: any) => {
        try {
            toast.promise(mintDigitalTwin("0x...", product.id, product.name), {
                loading: 'Minting Digital Twin on Blockchain...',
                success: (data: any) => {
                    return data.success ? `Digital Twin Minted! Hash: ${data.hash}` : `Minting Failed: ${data.error}`;
                },
                error: 'Minting failed',
            });
        } catch (error) {
            toast.error("Minting failed");
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetching all products for now
                const data = await apiClient<any[]>('/api/products');
                setProducts(data);
            } catch (err) {
                console.error("Failed to load products", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="container mx-auto max-w-6xl space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                        <p className="text-muted-foreground">Manage your product inventory.</p>
                    </div>
                    <Link href="/vendor/add-product">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Inventory</CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search products..." className="pl-8" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <motion.tbody
                                    initial="hidden"
                                    animate="show"
                                    variants={{
                                        hidden: {},
                                        show: {
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                >
                                    {products.map((product) => (
                                        <motion.tr
                                            key={product.id}
                                            variants={{
                                                hidden: { opacity: 0, x: -20 },
                                                show: { opacity: 1, x: 0 }
                                            }}
                                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                        >
                                            <TableCell>
                                                <div className="relative w-12 h-12 rounded border bg-white overflow-hidden">
                                                    <Image src={product.image_url || '/placeholder.jpg'} alt={product.name} fill className="object-contain p-1" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {product.name}
                                                {/* Assuming isDigitalTwin flag in backend, optional check */}
                                                {product.is_digital_twin && <Badge variant="secondary" className="ml-2 text-xs">Digital Twin</Badge>}
                                            </TableCell>
                                            <TableCell>${product.price}</TableCell>
                                            <TableCell>{product.stock}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={product.stock > 0 ? "text-green-600 border-green-600 bg-green-50" : "text-red-500 border-red-500"}>
                                                    {product.stock > 0 ? 'Active' : 'Out of Stock'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleMint(product)}>
                                                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                                                            Mint Digital Twin
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </motion.tbody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
