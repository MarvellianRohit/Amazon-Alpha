'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { AlertCircle, CheckCircle } from "lucide-react";

// Mock Data for demonstration
const MOCK_INVENTORY: Product[] = [
    {
        id: '1',
        name: 'Sony WH-1000XM5',
        description: 'Headphones',
        price: 348.00,
        stock: 45,
        category: 'Electronics',
        vendorId: 'vendor-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Smartphone',
        price: 1299.00,
        stock: 5, // LOW STOCK
        category: 'Electronics',
        vendorId: 'vendor-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Logitech MX Keys',
        description: 'Keyboard',
        price: 99.99,
        stock: 8, // LOW STOCK
        category: 'Electronics',
        vendorId: 'vendor-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '4',
        name: 'USB-C Cable (2m)',
        description: 'Cable',
        price: 19.99,
        stock: 150,
        category: 'Electronics',
        vendorId: 'vendor-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export function InventoryTable() {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock Level</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {MOCK_INVENTORY.map((product) => {
                        const isLowStock = product.stock < 10;
                        return (
                            <TableRow key={product.id} className={isLowStock ? "bg-red-50 hover:bg-red-100" : ""}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <span className={isLowStock ? "font-bold text-red-600" : ""}>
                                        {product.stock}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={isLowStock ? "destructive" : "outline"} className="gap-1">
                                        {isLowStock ? (
                                            <><AlertCircle className="w-3 h-3" /> Low Stock</>
                                        ) : (
                                            <><CheckCircle className="w-3 h-3 text-green-500" /> In Stock</>
                                        )}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
