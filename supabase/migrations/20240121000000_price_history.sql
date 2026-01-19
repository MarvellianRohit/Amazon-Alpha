-- Create Price History Table
CREATE TABLE IF NOT EXISTS public.price_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast retrieval of product history
CREATE INDEX IF NOT EXISTS price_history_product_idx ON public.price_history(product_id);

-- Create Price Alerts Table
CREATE TABLE IF NOT EXISTS public.price_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Assuming auth.users
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    target_price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'triggered', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    triggered_at TIMESTAMPTZ
);

-- Trigger Function to Log Price Changes
CREATE OR REPLACE FUNCTION log_price_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log if price has changed
    IF NEW.price <> OLD.price THEN
        INSERT INTO public.price_history (product_id, price)
        VALUES (NEW.id, NEW.price);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach Trigger to Products Table
DROP TRIGGER IF EXISTS on_price_change ON public.products;
CREATE TRIGGER on_price_change
AFTER UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION log_price_change();
