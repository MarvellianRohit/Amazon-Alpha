-- Migration: Group Buy Squads

CREATE TABLE IF NOT EXISTS group_buy_squads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    
    current_count INTEGER DEFAULT 0,
    target_threshold INTEGER DEFAULT 10,
    
    status TEXT CHECK (status IN ('OPEN', 'LOCKED', 'COMPLETED', 'EXPIRED')) DEFAULT 'OPEN',
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE group_buy_squads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view open squads" ON group_buy_squads FOR SELECT USING (true);
CREATE POLICY "Service Role manages squads" ON group_buy_squads FOR ALL USING (true);
