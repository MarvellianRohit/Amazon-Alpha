-- Migration: Product Passports Expansion

-- Alter nft_registry to include provenance data
ALTER TABLE nft_registry 
ADD COLUMN IF NOT EXISTS batch_number TEXT,
ADD COLUMN IF NOT EXISTS manufacturing_date DATE,
ADD COLUMN IF NOT EXISTS logistics_path JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS current_owner_wallet TEXT;

-- Create a log for ownership transfers
CREATE TABLE IF NOT EXISTS ownership_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nft_id UUID NOT NULL REFERENCES nft_registry(id) ON DELETE CASCADE,
    from_user_id UUID REFERENCES auth.users(id),
    to_user_id UUID REFERENCES auth.users(id),
    transaction_hash TEXT,
    transferred_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE ownership_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View history of owned items" ON ownership_history
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM nft_registry WHERE nft_registry.id = ownership_history.nft_id AND nft_registry.user_id = auth.uid())
    );
