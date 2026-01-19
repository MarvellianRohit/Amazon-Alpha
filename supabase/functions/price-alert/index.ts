import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Get Payload (Product that updated)
        // Note: We expect this function to be called via Database Webhook ideally, 
        // or manually triggered after a price update API call.
        // For this demo, we handle a simple POST with { productId, newPrice }
        const { productId, newPrice } = await req.json()

        if (!productId || !newPrice) {
            throw new Error("Missing productId or newPrice")
        }

        // 2. Find matching alerts
        // "Find users who wanted this product for MORE than the current price" (i.e. price dropped below their target)
        // Wait, target_price is usually "Notify me when price is X". 
        // If current price <= target_price, trigger.
        const { data: alerts, error } = await supabase
            .from('price_alerts')
            .select('*')
            .eq('product_id', productId)
            .eq('status', 'active')
            .gte('target_price', newPrice)

        if (error) throw error

        console.log(`Checking alerts for Product ${productId} at $${newPrice}. Found ${alerts.length} matching alerts.`)

        // 3. Process Alerts (Send Notification & Update Status)
        const notifications = alerts.map(async (alert) => {
            // Here we would send Email/Push
            console.log(`[Mock Notification] To User ${alert.user_id}: Price dropped to $${newPrice}! (Target: $${alert.target_price})`)

            // Update Alert to triggered
            await supabase
                .from('price_alerts')
                .update({ status: 'triggered', triggered_at: new Date().toISOString() })
                .eq('id', alert.id)
        })

        await Promise.all(notifications)

        return new Response(
            JSON.stringify({ message: `Processed ${alerts.length} alerts`, alerts }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
