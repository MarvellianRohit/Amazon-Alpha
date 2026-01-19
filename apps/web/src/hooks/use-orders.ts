"use client"

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useOrders() {
    const supabase = createClient()

    return useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return []

            const res = await fetch('http://127.0.0.1:8000/api/orders/', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            })

            if (!res.ok) throw new Error('Failed to fetch orders')
            return res.json()
        }
    })
}
