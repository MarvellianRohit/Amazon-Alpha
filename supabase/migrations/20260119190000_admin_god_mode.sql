-- Add status column to vendors
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'status') THEN
        ALTER TABLE public.vendors ADD COLUMN status TEXT CHECK (status IN ('pending', 'active', 'rejected', 'suspended')) DEFAULT 'pending';
    END IF;
END $$;

-- RPC to get God Mode Stats
CREATE OR REPLACE FUNCTION get_admin_god_mode_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_revenue DECIMAL(10, 2);
    total_commission DECIMAL(10, 2);
    pending_vendors_count INTEGER;
    active_vendors_count INTEGER;
    total_users_count INTEGER;
BEGIN
    -- Calculate Total GMV (Gross Merchandise Value)
    SELECT COALESCE(SUM(total_amount), 0) INTO total_revenue FROM orders;
    
    -- Calculate Total Commission (Platform Fee)
    SELECT COALESCE(SUM(platform_fee), 0) INTO total_commission FROM orders;

    -- Count Vendors by Status
    SELECT COUNT(*) INTO pending_vendors_count FROM vendors WHERE status = 'pending';
    SELECT COUNT(*) INTO active_vendors_count FROM vendors WHERE status = 'active';

    -- Count Total Users (Approximation from vendors due to auth user restrictions, 
    -- in a real app we might query auth.users if we have permissions, or a public profile table)
    -- For now, returning dummy or partial count. 
    -- Let's just count vendors + customers in orders to be safe or just return 0 if strictly separate.
    -- We'll assume we want to know total vendors for now.
    
    RETURN json_build_object(
        'total_revenue', total_revenue,
        'total_commission', total_commission,
        'pending_vendors', pending_vendors_count,
        'active_vendors', active_vendors_count
    );
END;
$$;
