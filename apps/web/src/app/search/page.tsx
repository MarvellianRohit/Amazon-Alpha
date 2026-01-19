'use client';

import { useState, useEffect } from "react";
import { LoadingSkeleton } from "@/components/search/loading-skeleton";
import { SearchFilters } from "@/components/search/search-filters";
import { ProductResultCard } from "@/components/search/product-card";
import { Product } from "@/types";

// Mock Data
const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise canceling with Auto NC Optimizer.',
        price: 348.00,
        stock: 15,
        category: 'Electronics',
        vendorId: 'vendor-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Samsung Galaxy Watch 6',
        description: 'Keep your goals on track with advanced sleep coaching.',
        price: 299.99,
        stock: 8,
        category: 'Electronics',
        vendorId: 'vendor-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Logitech MX Master 3S',
        description: 'Performance Wireless Mouse with Ultra-fast Scrolling.',
        price: 99.99,
        stock: 50,
        category: 'Electronics',
        vendorId: 'vendor-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '4',
        name: 'Apple AirTag 4 Pack',
        description: 'Keep track of and find your items alongside friends and devices.',
        price: 89.00,
        stock: 100,
        category: 'Electronics',
        vendorId: 'vendor-3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export default function SearchPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate network delay to show off skeletons
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Search Results</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1">
                    <SearchFilters />
                </div>

                {/* Results Grid */}
                <div className="lg:col-span-3">
                    <div className="mb-4 text-sm text-muted-foreground">
                        {isLoading ? "Searching..." : `Showing ${MOCK_PRODUCTS.length} results`}
                    </div>

                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {MOCK_PRODUCTS.map((product) => (
                                <ProductResultCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
