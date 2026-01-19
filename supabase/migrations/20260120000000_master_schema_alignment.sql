-- Master Schema Alignment Migration
-- Purpose: strictly fulfill the "Master Data Schema Prompt" requirements

-- 1. Profiles: Add Enum Role if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM ('admin', 'vendor', 'student', 'customer');
    END IF;
END $$;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_role user_role_enum DEFAULT 'customer',
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Vendors: Add commission_rate and business_email
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(4, 2) DEFAULT 10.00,
ADD COLUMN IF NOT EXISTS business_email TEXT,
ADD COLUMN IF NOT EXISTS vendor_rating DECIMAL(3, 2) DEFAULT 5.00;

-- 3. Products: Add student_price and Update Vector Dimension
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS student_price DECIMAL(10, 2);

-- Note: Changing vector dimension requires dropping the column/index usually.
-- For this alignment, we will adjust the column to support 1536 as requested.
-- WARNING: This clears existing embeddings if re-typed.
ALTER TABLE public.products 
ALTER COLUMN embedding TYPE vector(1536) USING (
  CASE 
    WHEN array_length(vector_to_float4(embedding, 0, false), 1) = 768 
    THEN (vector_to_float4(embedding, 0, false) || array_fill(0::float4, ARRAY[768]))::vector(1536)
    ELSE embedding::vector(1536) 
  END
);

-- 4. Orders: Add total_discount_applied
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS total_discount_applied DECIMAL(10, 2) DEFAULT 0.00;

-- 5. Student Verifications Table
CREATE TABLE IF NOT EXISTS public.student_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    college_name TEXT NOT NULL,
    student_id_url TEXT NOT NULL,
    expiry_date DATE,
    verification_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. RLS Alignment
ALTER TABLE public.student_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verification" ON public.student_verifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access" ON public.student_verifications
    FOR ALL USING (
        (SELECT user_role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );
