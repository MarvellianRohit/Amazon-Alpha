"use client"

import { useQuery } from '@tanstack/react-query'
import { RECENT_ORDERS } from '@/lib/mock-data'

export function useOrders() {
    return useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800))

            // Return mock orders with enriched data structure if needed
            // The Page component expects: id, status, total_amount, created_at, items[]
            return RECENT_ORDERS.map(order => ({
                id: `ORD-${order.id}`,
                status: order.status,
                total_amount: order.total,
                created_at: new Date().toISOString(), // Mock date
                items: [
                    { id: 'item-1', quantity: 1, product_id: 'prod_1' },
                    { id: 'item-2', quantity: 2, product_id: 'prod_2' }
                ]
            }))
        }
    })
}
