export type Category = 'Electronics' | 'Clothing' | 'Books' | 'Home' | 'Beauty' | 'Sports' | 'Other';

export interface Vendor {
    id: string;
    name: string;
    email: string;
    logoUrl?: string;
    description?: string;
    vacationMode: boolean;
    isSuspended: boolean;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: Category;
    imageUrl?: string;
    vendorId: string;
    studentPrice?: number;
    createdAt: string;
    updatedAt: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    productId: string;
    quantity: number;
    priceAtPurchase: number;
}

export interface Order {
    id: string;
    customerId: string;
    vendorId: string; // Simplification: assuming per-vendor orders or mixed but tracked
    items: OrderItem[];
    totalAmount: number;
    platformFee: number;
    vendorPayout: number;
    isFlagged: boolean;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    averageOrderValue: number;
}
