-- Add vacation_mode to vendors
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'vacation_mode') THEN
        ALTER TABLE public.vendors ADD COLUMN vacation_mode BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id), -- Assuming customers are auth users
    vendor_id UUID REFERENCES public.vendors(user_id) ON DELETE SET NULL, -- Simplification for single-vendor orders
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- 10% cut
    vendor_payout DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- 90% payout
    status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = vendor_id);

CREATE POLICY "Customers can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = customer_id);

-- Create order_items table for line items
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view order items of visible orders" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE public.orders.id = order_items.order_id
        )
    );
