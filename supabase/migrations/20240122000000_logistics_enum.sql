-- Create Order Status Enum
CREATE TYPE public.order_status AS ENUM ('Pending', 'Shipped', 'In-Transit', 'Out-for-Delivery', 'Delivered');

-- Alter orders table to use the new enum
-- Note: If table already has data with text statuses, we might need a USING clause to cast them.
-- For this setup, we assume new or compatible data.
ALTER TABLE public.orders 
ALTER COLUMN status TYPE public.order_status 
USING status::public.order_status;

-- Default to pending
ALTER TABLE public.orders 
ALTER COLUMN status SET DEFAULT 'Pending'::public.order_status;
